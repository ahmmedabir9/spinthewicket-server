import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import { ballResult } from '../functions/playMatch/ballResult';
import { ballValidation } from '../functions/playMatch/ballValidation';
import { getLastSpinPosition } from '../functions/playMatch/getLastSpinPosition';
import { getMatchFunction } from '../functions/playMatch/getMatchFunction';
import { prepareBallData } from '../functions/playMatch/prepareBallData';
import { DreamTeam } from '../models/DreamTeam.model';
import { DreamTeamMatch } from '../models/DreamTeamMatch.model';
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
    const { team, overs, user } = req.body;

    if (!team || !overs || !user) {
      let msg = 'provide all informations!';
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
      battingScorer = null,
      bowlingScorer = null,
      liveData = { ...initialLiveData };
    const tossResult = Math.floor(Math.random() * 10000) % 2;
    // const tossResult = Math.floor(Math.random() * 10000) % 2;
    let toss;

    if (tossResult === 0) {
      toss = {
        team: dreamTeam?._id?.toString(),
        selectedTo: null,
      };
    } else {
      const choosen = Math.floor(Math.random() * 10000) % 2;
      toss = {
        team: opponentTeam?._id?.toString(),
        selectedTo: choosen === 0 ? 'bat' : 'bowl',
      };
      battingTeam = choosen === 0 ? opponentTeam?._id?.toString() : dreamTeam?._id?.toString();
      bowlingTeam = choosen === 1 ? opponentTeam?._id?.toString() : dreamTeam?._id?.toString();
      battingScorer = choosen === 0 ? null : user;
      bowlingScorer = choosen === 1 ? null : user;
      liveData = {
        inning: 'first',
        battingTeam: battingTeam,
        bowlingTeam: bowlingTeam,
        battingScorer: battingScorer,
        bowlingScorer: bowlingScorer,
        ...initialLiveData,
      };
    }

    const innings = {
      first: {
        battingTeam: battingTeam,
        bowlingTeam: bowlingTeam,
        battingScorer: battingScorer,
        bowlingScorer: bowlingScorer,
        ...initialInningData,
      },
      second: {
        battingTeam: bowlingTeam,
        bowlingTeam: battingTeam,
        battingScorer: bowlingScorer,
        bowlingScorer: battingScorer,
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
      overs: parseInt(overs),
      status: toss.team === dreamTeam?._id?.toString() ? 'toss' : 'live',
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

const getMatchData = async (args: any) => {
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

    return socketResponse(true, matchData, null);
  } catch (error) {
    console.log('💡 | file: dreamTeamMatch.controller.ts:220 | error:', error);
    return socketResponse(false, null, error.message);
  }
};

const updateMatchData = async (args: any, data: any) => {
  try {
    if (!data) {
      return socketResponse(false, null, 'Nothing to Update!');
    }

    const { id } = args;
    const { selectedTo, striker, nonStriker, bowler, user, ...rest } = data;
    let matchData: Partial<_IMatch_> = await DreamTeamMatch.findById(id);
    let updateData: any = {};

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
      if (matchData?.innings[matchData?.liveData?.inning]?.battingOrder?.find((b) => b.id?.toString() === striker?.toString())) {
        return socketResponse(false, null, 'Batsman Already Played!');
      }

      updateData = {
        ...updateData,
        'liveData.batsman.striker': {
          id: striker,
          inAt: matchData?.innings[matchData?.liveData?.inning]?.battingOrder?.length + 1,
          ...initialMatchBatsmanData,
        },
      };
    }
    // Select NonStriker
    if (nonStriker) {
      if (matchData?.innings[matchData?.liveData?.inning]?.battingOrder?.find((b) => b.id?.toString() === nonStriker?.toString())) {
        return socketResponse(false, null, 'Batsman Already Played!');
      }

      updateData = {
        ...updateData,
        'liveData.batsman.nonStriker': {
          id: nonStriker,
          inAt:
            matchData?.innings[matchData?.liveData?.inning]?.battingOrder?.length +
            (!matchData?.innings[matchData?.liveData?.inning]?.battingOrder?.length ? 2 : 1),
          ...initialMatchBatsmanData,
        },
      };
    }
    // Select Bowler
    if (bowler) {
      let newBolwer = matchData?.innings[matchData?.liveData?.inning]?.bowlingOrder?.find((b) => b.id?.toString() === bowler?.toString()) || {
        ...initialMatchBowlerData,
        id: bowler,
      };

      if (newBolwer?.overs === (matchData?.overs / 5).toFixed(0)) {
        return socketResponse(false, null, 'No Over Left to Bowl!');
      }

      updateData = {
        ...updateData,
        'liveData.bowler': newBolwer,
      };
    }

    matchData = await DreamTeamMatch.findByIdAndUpdate(id, { ...updateData, ...rest }, { new: true });

    return socketResponse(true, matchData, null);
  } catch (error) {
    return socketResponse(false, null, error.message);
  }
};

const playMatch = async (data: any) => {
  try {
    const { match, bat, bowl, team } = data;

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
      const ballAction = 'WIDE';
      // const ballAction = ballResult(bat, bowl);
      console.log('💡 | file: dreamTeamMatch.controller.ts:301 | ballAction:', ballAction);

      if (!ballAction) return socketResponse(false, null, 'Failed to generate ball result!');

      const lastSpinPosition = getLastSpinPosition(ballAction);

      const ballData = prepareBallData(matchData, ballAction, battingTeam, bowlingTeam);
      const ballResponse = await getMatchFunction(ballAction, matchData, ballData, battingTeam);
      console.log('💡 | file: dreamTeamMatch.controller.ts:343 | ballResponse:', ballResponse);

      if (!ballResponse?.success) {
        return socketResponse(false, null, ballResponse?.message);
      }

      const updateData = {
        'liveData.lastSpinPosition': lastSpinPosition,
        'liveData.spinning': false,
      };

      matchData = await DreamTeamMatch.findByIdAndUpdate(matchData._id, updateData, {
        new: true,
      }).select('innings liveData title');

      //BROADCAST THE UPDATED DATA

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
