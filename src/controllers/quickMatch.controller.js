const { StatusCodes } = require("http-status-codes");
const { DreamTeam } = require("../models/DreamTeam.model");
const { response } = require("../utils/response");
const { CreateQuickMatch } = require("../services/firebase");
const { v4: uuidv4 } = require("uuid");
// const collectIdsAndDocs = require("../../../utils/collectIdsAndDocs");

const teamPopulate = [
  { path: "theme" },
  { path: "manager" },
  {
    path: "captain",
    populate: {
      path: "playerInfo",
    },
  },
  {
    path: "playingXI",
    populate: {
      path: "playerInfo",
    },
  },
];

const startQuickMatch = async (req, res) => {
  try {
    const { team, overs, user } = req.body;

    if (!team || !overs || !user) {
      let msg = "provide all informations!";
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    //verify and get team
    const dreamTeam = await DreamTeam.findById(team).populate(teamPopulate);

    if (!dreamTeam) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        null,
        "Dream Team Not Found"
      );
    }

    if (dreamTeam?.manager?._id?.toString() !== user?.toString()) {
      return response(
        res,
        StatusCodes.FORBIDDEN,
        false,
        null,
        "You dont have permission to play with this team!"
      );
    }

    //find opponent
    const botTeams = await DreamTeam.find({
      rating: { $gte: dreamTeam.rating - 5 },
      rating: { $lte: dreamTeam.rating + 5 },
      isBot: true,
    });

    if (!botTeams || !botTeams?.length === 0) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        null,
        "No Opponent Found"
      );
    }

    const opponentTeam = botTeams[Math.floor(Math.random() * botTeams.length)];

    //prepare match data

    var battingTeam = null,
      bowlingTeam = null,
      battingScorer = null,
      bowlingScorer = null,
      now = null;
    const tossResult = Math.floor(Math.random() * 10000) % 2;
    var toss;

    if (tossResult === 0) {
      toss = {
        team: dreamTeam?._id?.toString(),
      };
    } else {
      const choosen = Math.floor(Math.random() * 10000) % 2;
      toss = {
        team: opponentTeam?._id?.toString(),
        selected: choosen === 0 ? "bat" : "bowl",
      };
      battingTeam =
        choosen === 0
          ? opponentTeam?._id?.toString()
          : dreamTeam?._id?.toString();
      bowlingTeam =
        choosen === 1
          ? opponentTeam?._id?.toString()
          : dreamTeam?._id?.toString();
      battingScorer = choosen === 0 ? null : user;
      bowlingScorer = choosen === 1 ? null : user;
      now = {
        inning: 1,
        battingTeam: battingTeam,
        bowlingTeam: bowlingTeam,
        battingScorer: battingScorer,
        bowlingScorer: bowlingScorer,
        batsman: {},
        bowler: null,
        overs: 0,
        balls: 0,
        runs: 0,
        wickets: 0,
        runRate: 0,
        extra: 0,
        partnership: {
          balls: 0,
          runs: 0,
          batsman1: null,
          batsman2: null,
        },
        freeHit: false,
        history: [],
        spinning: false,
        lastSpinPosition: 0,
      };
    }

    const innings = {
      first: {
        battingTeam: battingTeam,
        bowlingTeam: bowlingTeam,
        battingScorer: battingScorer,
        bowlingScorer: bowlingScorer,
        battingOrder: [],
        bowlingOrder: [],
        partnerships: [],
        fallOfWickets: [],
        overHistory: [],
        overs: 0,
        balls: 0,
        runs: 0,
        wickets: 0,
        runRate: 0,
        extra: 0,
      },
      second: {
        battingTeam: bowlingTeam,
        bowlingTeam: battingTeam,
        battingScorer: bowlingScorer,
        bowlingScorer: battingScorer,
        battingOrder: [],
        bowlingOrder: [],
        partnerships: [],
        fallOfWickets: [],
        overHistory: [],
        overs: 0,
        balls: 0,
        runs: 0,
        wickets: 0,
        runRate: 0,
        extra: 0,
      },
    };

    const createdAt = new Date();

    const matchData = {
      type: "quick",
      teams: {
        a: dreamTeam?._id?.toString(),
        b: opponentTeam?._id?.toString(),
      },
      scorers: { a: user, b: null },
      overs: parseInt(overs),
      status: toss.team === dreamTeam?._id?.toString() ? "toss" : "live",
      createdAt: createdAt.toString(),
      playingXI: {
        [dreamTeam?._id?.toString()]: dreamTeam?.playingXI?.map((player) =>
          player?._id?.toString()
        ),
        [opponentTeam?._id?.toString()]: opponentTeam?.playingXI?.map(
          (player) => player?._id?.toString()
        ),
      },
      ready: { a: false, b: true },
      users: [user],
      toss: toss,
      now,
      innings,
    };

    const matchID = uuidv4();

    //save match data
    const quickMatch = await CreateQuickMatch(`quick_matches`, matchData);

    return response(res, StatusCodes.ACCEPTED, true, quickMatch, null);
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      null,
      error.message
    );
  }
};

module.exports = { startQuickMatch };
