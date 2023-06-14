import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

// import { ballResult } from '../functions/playMatch/ballResult';
// import { ballValidation } from '../functions/playMatch/ballValidation';
// import prepareBallData from '../functions/playMatch/prepareBallData';
import { DreamPlayer } from '../models/DreamPlayer.model';
import { DreamTeam } from '../models/DreamTeam.model';
import { DreamTeamMatch } from '../models/DreamTeamMatch.model';
import User from '../models/User.model';
// import { _IDreamTeam_ } from '../models/_ModelTypes_';
import { CreateQuickMatch, GetQuickMatch, UpdateQuickMatch } from '../services/firebase';
import { SocketResponder } from '../services/socketService';
import { initialInningData, initialLiveData } from '../utils/constants';
import { response } from '../utils/response';
import { socketResponse } from '../utils/socketResponse';

// const {
//   twoRuns,
//   threeRuns,
//   fourRuns,
//   sixRuns,
//   noBall,
//   wideBall,
//   oneRun,
//   dotBall,
//   catchOut,
//   lbw,
//   runOut,
//   bowled,
// } = require('../functions/playMatch');

// const collectIdsAndDocs = require("../../../utils/collectIdsAndDocs");

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
      return response(
        res,
        StatusCodes.FORBIDDEN,
        false,
        null,
        'You dont have permission to play with this team!',
      );
    }

    //find opponent
    const botTeams: any[] = await DreamTeam.find({
      rating: { $gte: dreamTeam.rating - 5, $lte: dreamTeam.rating + 5 },
      isBot: true,
    });

    if (botTeams?.length === 0) {
      return response(res, StatusCodes.NOT_FOUND, false, null, 'No Opponent Found');
    }

    const opponentTeam = botTeams[Math.floor(Math.random() * botTeams.length)];

    //prepare match data

    let battingTeam = null,
      bowlingTeam = null,
      battingScorer = null,
      bowlingScorer = null,
      now = null;
    const tossResult = Math.floor(Math.random() * 10000) % 2;
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
      now = {
        inning: 1,
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
      playingXI: {
        [dreamTeam?._id?.toString()]: dreamTeam?.playingXI?.map((player) =>
          player?._id?.toString(),
        ),
        [opponentTeam?._id?.toString()]: opponentTeam?.playingXI?.map((player) =>
          player?._id?.toString(),
        ),
      },
      ready: {
        [user?.toString()]: false,
      },
      users: [user],
      toss: toss,
      now,
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

    const matchData: any = await DreamTeamMatch.findById(id).populate(matchPopulate);

    return socketResponse(true, matchData, null);
  } catch (error) {
    console.log('💡 | file: dreamTeamMatch.controller.ts:220 | error:', error);
    return socketResponse(false, null, error.message);
  }
};

const playQuickMatch = async (req, res) => {
  try {
    // const { match, bat, bowl } = req.body;

    // if (!match || !bat || !bowl) {
    //   return response(
    //     res,
    //     StatusCodes.NOT_FOUND,
    //     false,
    //     null,
    //     'match, bat, bowl are required field!',
    //   );
    // }

    // const matchData = await GetQuickMatch(match);

    // if (!matchData) {
    //   return response(res, StatusCodes.NOT_FOUND, false, null, 'No Match Found!');
    // }

    // var inning;
    // if (matchData.now.inning === 1) {
    //   inning = 'first';
    // } else if (matchData.now.inning === 2) {
    //   inning = 'second';
    // } else if (matchData.now.inning === 3) {
    //   inning = 'firstSuper';
    // } else if (matchData.now.inning === 4) {
    //   inning = 'secondSuper';
    // }

    // const ballAction = 'SIX';
    // // const ballAction = ballResult(bat, bowl)

    // var pointed;
    // if (ballAction === 'ONE') pointed = 154;
    // else if (ballAction === 'BOWLED') pointed = 244;
    // else if (ballAction === 'SIX') pointed = 34;
    // else if (ballAction === 'WIDE') pointed = 4;
    // else if (ballAction === 'RUN_OUT') pointed = 334;
    // else if (ballAction === 'TWO') pointed = 94;
    // else if (ballAction === 'THREE') pointed = 274;
    // else if (ballAction === 'LBW') pointed = 124;
    // else if (ballAction === 'NO_BALL') pointed = 64;
    // else if (ballAction === 'FOUR') pointed = 304;
    // else if (ballAction === 'CATCH') pointed = 184;
    // else if (ballAction === 'DOT') pointed = 214;

    // const lastSpinPosition = 0 - (pointed + Math.floor(Math.random() * 22));

    // const ballData = prepareBallData(matchData, ballAction);

    // if (ballValidation(matchData)) {
    //   const handler = async () => {
    //     let ballResponse;
    //     if (ballAction === 'DOT') ballResponse = await dotBall(matchData, ballData, inning);
    //     else if (ballAction === 'ONE') ballResponse = await oneRun(matchData, ballData, inning);
    //     else if (ballAction === 'TWO') ballResponse = await twoRuns(matchData, ballData, inning);
    //     else if (ballAction === 'THREE')
    //       ballResponse = await threeRuns(matchData, ballData, inning);
    //     else if (ballAction === 'FOUR') ballResponse = await fourRuns(matchData, ballData, inning);
    //     else if (ballAction === 'SIX') ballResponse = await sixRuns(matchData, ballData, inning);
    //     else if (ballAction === 'WIDE') ballResponse = await wideBall(matchData, ballData, inning);
    //     else if (ballAction === 'NO_BALL') ballResponse = await noBall(matchData, ballData, inning);
    //     else if (ballAction === 'BOWLED') {
    //       if (matchData?.now?.freeHit) {
    //         ballResponse = await dotBall(matchData, ballData, inning);
    //       } else {
    //         ballResponse = await bowled(matchData, ballData, inning);
    //       }
    //     } else if (ballAction === 'LBW') {
    //       if (matchData?.now?.freeHit) {
    //         ballResponse = await dotBall(matchData, ballData, inning);
    //       } else {
    //         ballResponse = await lbw(matchData, ballData, inning);
    //       }
    //     } else if (ballAction === 'CATCH') {
    //       if (matchData?.now?.freeHit) {
    //         ballResponse = await dotBall(matchData, ballData, inning);
    //       } else {
    //         ballResponse = await catchOut(matchData, ballData, inning);
    //       }
    //     } else if (ballAction === 'RUN_OUT')
    //       ballResponse = await runOut(matchData, ballData, inning);

    //     if (!ballResponse?.success) {
    //       return response(
    //         res,
    //         StatusCodes.BAD_REQUEST,
    //         false,
    //         ballResponse,
    //         'Something went wrong!',
    //       );
    //     }

    //     const updateData = {
    //       'now.lastSpinPosition': lastSpinPosition,
    //       'now.spinning': false,
    //     };

    //     await UpdateQuickMatch(match, updateData);
    //     return response(res, StatusCodes.ACCEPTED, true, ballResponse, null);
    //   };

    //   // setTimeout(() => {
    //   handler();
    //   // }, 3000)
    // } else {
    return response(res, StatusCodes.BAD_REQUEST, false, null, 'SOMETHING WENT WRONG');
    // }
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

export { startQuickMatch, getMatchData, playQuickMatch };
