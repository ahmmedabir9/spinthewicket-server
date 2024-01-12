import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ballResult } from '../functions/playMatch/ballResult';
import { ballValidation } from '../functions/playMatch/ballValidation';
import { getLastSpinPosition } from '../functions/playMatch/getLastSpinPosition';
import { getMatchFunction } from '../functions/playMatch/getMatchFunction';
import { prepareBallData } from '../functions/playMatch/prepareBallData';
import { DreamTeam } from '../models/DreamTeam.model';
import { DreamTeamMatch } from '../models/DreamTeamMatch.model';
import { PlayerInfo } from '../models/PlayerInfo.model';
import { _IMatch_ } from '../models/_ModelTypes_';
import { initialInningData, initialLiveData, initialMatchBatsmanData, initialMatchBowlerData } from '../utils/constants';
import { response } from '../utils/response';
import { socketResponse } from '../utils/socketResponse';

const teamPopulate = [
  { path: 'theme' },
  { path: 'manager' },
  {
    path: 'captain',
    populate: {
      path: 'playerInfo',
    },
  },
  {
    path: 'playingXI',
    populate: {
      path: 'playerInfo',
    },
  },
];

const playerPopulate = [
  {
    path: 'playerInfo',
  },
];

const matchPopulate = [
  { path: 'teams.teamA', populate: teamPopulate },
  { path: 'teams.teamB', populate: teamPopulate },
  { path: 'squad.teamA.playingXI', populate: playerPopulate },
  { path: 'squad.teamB.playingXI', populate: playerPopulate },
  {
    path: 'users',
  },
];

const startQuickMatch = async (req: Request, res: Response) => {
  try {
    const { team, overs, user, matchMode } = req.body;

    //

    if (!team || !overs || !user) {
      const msg = 'provide all informations!';
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    //verify and get team
    const dreamTeam: any = await DreamTeam.findById(team).populate(teamPopulate);

    if (!dreamTeam) {
      return response(res, StatusCodes.NOT_FOUND, false, null, 'Dream Team Not Found');
    }

    if (dreamTeam?.manager?._id?.toString() !== user?.toString()) {
      return response(res, StatusCodes.FORBIDDEN, false, null, 'You dont have permission to play with this team!');
    }

    //find opponent
    const botTeams: any[] = await DreamTeam.find({
      rating: { $gte: dreamTeam.rating - 5, $lte: dreamTeam.rating + 5 },
      isBot: true,
    }).populate(teamPopulate);

    if (botTeams?.length === 0) {
      return response(res, StatusCodes.NOT_FOUND, false, null, 'No Opponent Found');
    }

    const opponentTeam = botTeams[Math.floor(Math.random() * botTeams.length)];

    //prepare match data

    let battingTeam = null,
      bowlingTeam = null,
      liveData = { ...initialLiveData };
    const tossResult = Math.floor(Math.random() * 10000) % 2;
    // const tossResult = Math.floor(Math.random() * 10000) % 2;

    const choosen = Math.floor(Math.random() * 10000) % 2;
    const toss = {
      team: tossResult === 0 ? dreamTeam?._id?.toString() : opponentTeam?._id?.toString(),
      selectedTo: choosen === 0 ? 'bat' : 'bowl',
    };
    battingTeam = choosen === 0 ? opponentTeam?._id?.toString() : dreamTeam?._id?.toString();
    bowlingTeam = choosen === 1 ? opponentTeam?._id?.toString() : dreamTeam?._id?.toString();
    const teamAStatus =
      toss.team === dreamTeam?._id?.toString()
        ? toss.selectedTo === 'bat'
          ? 'batting'
          : 'bowling'
        : toss.selectedTo === 'bat'
          ? 'bowling'
          : 'batting';
    const teamBStatus =
      toss.team === dreamTeam?._id?.toString()
        ? toss.selectedTo === 'bat'
          ? 'bowling'
          : 'batting'
        : toss.selectedTo === 'bat'
          ? 'batting'
          : 'bowling';

    liveData = {
      teamA: {
        scorer: user,
        status: matchMode === 'h2h' ? 'batting' : teamAStatus,
        ...initialLiveData,
      },
      teamB: {
        scorer: null,
        status: matchMode === 'h2h' ? 'batting' : teamBStatus,
        ...initialLiveData,
      },
    };
    console.log('💡 | liveData:', liveData);

    const innings = {
      first: {
        battingTeam: battingTeam,
        bowlingTeam: bowlingTeam,
        ...initialInningData,
      },
      second: {
        battingTeam: bowlingTeam,
        bowlingTeam: battingTeam,
        ...initialInningData,
      },
    };

    const createdAt = new Date();

    const matchData = {
      title: `${dreamTeam.title} vs ${opponentTeam?.title}`,
      matchType: 'quick',
      teams: {
        teamA: dreamTeam?._id?.toString(),
        teamB: opponentTeam?._id?.toString(),
      },
      scorers: { a: user, b: null },
      matchMode: matchMode || 'h2h',
      overs: parseInt(overs),
      status: 'live',
      createdAt: createdAt.toString(),
      squad: {
        teamA: {
          playingXI: dreamTeam?.playingXI?.map((player) => player?._id),
          team: dreamTeam?._id,
        },
        teamB: {
          playingXI: opponentTeam?.playingXI?.map((player) => player?._id),
          team: opponentTeam?._id,
        },
      },
      ready: {
        [user?.toString()]: false,
      },
      users: [user],
      toss: toss,
      liveData: liveData,
      innings,
    };

    //save match data
    const quickMatch = new DreamTeamMatch(matchData);
    await quickMatch.save();

    return response(res, StatusCodes.ACCEPTED, true, quickMatch, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

const getMatchData = async (args: any, app: any, responder: any) => {
  try {
    const { id } = args;

    const matchData: any = await DreamTeamMatch.findById(id).populate([
      {
        path: 'teams.teamA',
        populate: {
          path: 'theme',
        },
      },
      {
        path: 'teams.teamB',
        populate: {
          path: 'theme',
        },
      },
      {
        path: 'squad.teamA.playingXI',
        populate: {
          path: 'playerInfo',
        },
      },
      {
        path: 'squad.teamB.playingXI',
        populate: {
          path: 'playerInfo',
        },
      },
    ]);

    // join the user to this match group in socket
    app.socketConnections.addToGroup(`dream-team-match-${id}`, responder.socket);

    return socketResponse(true, matchData, null);
  } catch (error) {
    console.log('💡 | file: dreamTeamMatch.controller.ts:220 | error:', error);
    return socketResponse(false, null, error.message);
  }
};

const updateMatchData = async (args: any, data: any, app: any) => {
  try {
    if (!data) {
      return socketResponse(false, null, 'Nothing to Update!');
    }

    const { id } = args;
    const { selectedTo, striker, nonStriker, bowler, user, team, ...rest } = data;
    let matchData: Partial<_IMatch_> = await DreamTeamMatch.findById(id);
    let updateData: any = {};

    const currentInning =
      matchData?.innings?.first?.battingTeam?.toString() === matchData?.teams[team]?.toString() ? (bowler ? 'second' : 'first') : 'first';

    // Toss Update
    if (selectedTo) {
      updateData = {
        ...updateData,
        'toss.selectedTo': selectedTo,

        'liveData.inning': 'first',
        'liveData.battingTeam': selectedTo === 'bowl' ? matchData.teams.teamB?.toString() : matchData.teams.teamA?.toString(),
        'liveData.bowlingTeam': selectedTo === 'bat' ? matchData.teams.teamB?.toString() : matchData.teams.teamA?.toString(),
        'liveData.battingScorer': selectedTo === 'bowl' ? null : user,
        'liveData.bowlingScorer': selectedTo === 'bat' ? null : user,

        'innings.first.battingTeam': selectedTo === 'bowl' ? matchData.teams.teamB?.toString() : matchData.teams.teamA?.toString(),
        'innings.first.bowlingTeam': selectedTo === 'bat' ? matchData.teams.teamB?.toString() : matchData.teams.teamA?.toString(),
        'innings.first.battingScorer': selectedTo === 'bowl' ? null : user,
        'innings.first.bowlingScorer': selectedTo === 'bat' ? null : user,
        'innings.second.bowlingTeam': selectedTo === 'bowl' ? matchData.teams.teamB?.toString() : matchData.teams.teamA?.toString(),
        'innings.second.battingTeam': selectedTo === 'bat' ? matchData.teams.teamB?.toString() : matchData.teams.teamA?.toString(),
        'innings.second.bowlingScorer': selectedTo === 'bowl' ? null : user,
        'innings.second.battingScorer': selectedTo === 'bat' ? null : user,
      };
    }

    // Select Striker
    if (striker) {
      console.log('💡 | striker:', striker);
      if (matchData?.innings[currentInning]?.battingOrder?.find((b: any) => b.id?.toString() === striker?.toString())) {
        return socketResponse(false, null, 'Batsman Already Played!');
      }

      updateData = {
        ...updateData,
        [`liveData.${team}.batsman.striker`]: {
          id: striker,
          inAt: matchData?.innings[currentInning]?.battingOrder?.length + 1 || 1,
          ...initialMatchBatsmanData,
        },
      };
      console.log('💡 | updateData:', updateData);
    }
    // Select NonStriker
    if (nonStriker) {
      if (matchData?.innings[currentInning]?.battingOrder?.find((b: any) => b.id?.toString() === nonStriker?.toString())) {
        return socketResponse(false, null, 'Batsman Already Played!');
      }

      updateData = {
        ...updateData,
        [`liveData.${team}.batsman.nonStriker`]: {
          id: nonStriker,
          inAt: matchData?.innings[currentInning]?.battingOrder?.length + (!matchData?.innings[currentInning]?.battingOrder?.length ? 2 : 1),
          ...initialMatchBatsmanData,
        },
      };
    }
    // Select Bowler
    if (bowler) {
      const newBolwer = matchData?.innings[currentInning]?.bowlingOrder?.find((b: any) => b.id?.toString() === bowler?.toString()) || {
        ...initialMatchBowlerData,
        id: bowler,
      };

      if (newBolwer?.overs === Number((matchData?.overs / 5).toFixed(0))) {
        return socketResponse(false, null, 'No Over Left to Bowl!');
      }

      updateData = {
        ...updateData,
        [`liveData.${team}.bowler`]: newBolwer,
      };
    }

    matchData = await DreamTeamMatch.findByIdAndUpdate(id, { ...updateData, ...rest }, { new: true });
    console.log('💡 | matchData:', matchData);

    app.socketConnections.broadcastInMemory(`dream-team-match-${id}`, 'dream-team-match', {
      data: matchData,
      timestamp: new Date(),
    });
    return socketResponse(true, matchData, null);
  } catch (error) {
    return socketResponse(false, null, error.message);
  }
};

const playMatch = async (data: any, app: any) => {
  try {
    const { match, bat, bowl, team } = data;
    console.log('💡 | data:', data);

    if (!match || !bat || !bowl) {
      return socketResponse(false, null, 'Provide all Data!');
    }

    let matchData: Partial<_IMatch_> = await DreamTeamMatch.findById(match);

    if (!matchData) {
      return socketResponse(false, null, 'Match Not Found!');
    }

    // BROADCAST SPINNING RESPONSE

    const battingTeam = matchData?.teams?.teamA?.toString() === team ? 'teamA' : 'teamB';
    const bowlingTeam = matchData?.teams?.teamA?.toString() === team ? 'teamB' : 'teamA';

    if (ballValidation(matchData, battingTeam)) {
      matchData = await DreamTeamMatch.findByIdAndUpdate(
        matchData._id,
        {
          [`liveData.${battingTeam}.spinning`]: true,
        },
        {
          new: true,
        },
      ).select('innings liveData title');

      app.socketConnections.broadcastInMemory(`dream-team-match-${match}`, 'dream-team-match', {
        data: matchData,
        timestamp: new Date(),
      });

      // const ballAction = 'FOUR';
      const ballAction = ballResult(bat, bowl);
      console.log('💡 | file: dreamTeamMatch.controller.ts:301 | ballAction:', ballAction);

      if (!ballAction) return socketResponse(false, null, 'Failed to generate ball result!');

      const lastSpinPosition = getLastSpinPosition(ballAction);

      // const ballData = prepareBallData(matchData, ballAction, battingTeam, bowlingTeam);
      // const ballResponse = await getMatchFunction(ballAction, matchData, ballData, battingTeam);
      // console.log('💡 | file: dreamTeamMatch.controller.ts:343 | ballResponse:', ballResponse);

      // if (!ballResponse?.success) {
      //   return socketResponse(false, null, ballResponse?.message);
      // }

      const updateData = {
        [`liveData.${battingTeam}.lastSpinPosition`]: lastSpinPosition,
        [`liveData.${battingTeam}.spinning`]: false,
      };

      matchData = await DreamTeamMatch.findByIdAndUpdate(matchData._id, updateData, {
        new: true,
      }).select('innings liveData title');

      //BROADCAST THE UPDATED DATA

      setTimeout(() => {
        app.socketConnections.broadcastInMemory(`dream-team-match-${match}`, 'dream-team-match', {
          data: matchData,
          timestamp: new Date(),
        });
      }, 3000);
      return socketResponse(true, matchData, '');
    } else {
      return socketResponse(false, null, 'Invalid Play!');
    }
  } catch (error) {
    console.log('💡 | file: dreamTeamMatch.controller.ts:354 | error:', error);
    return socketResponse(false, null, 'Server Error!');
  }
};

export { startQuickMatch, getMatchData, playMatch, updateMatchData };
