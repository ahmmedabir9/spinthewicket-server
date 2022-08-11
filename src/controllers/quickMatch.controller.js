const { StatusCodes } = require("http-status-codes");
const { DreamTeam } = require("../models/DreamTeam.model");
const { response } = require("../utils/response");
const firebase = require("firebase-admin");
// const collectIdsAndDocs = require("../../../utils/collectIdsAndDocs");
const firestore = firebase.firestore();

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
    }

    const matchData = {
      type: "quick",
      teams: {
        a: dreamTeam?._id?.toString(),
        b: opponentTeam?._id?.toString(),
      },
      scorers: { a: user, b: null },
      overs: parseInt(overs),
      status: toss.team === dreamTeam?._id?.toString() ? "toss" : "live",
      createdAt: new Date(),
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
    };

    //save match data
    const docRef = firestore.doc("quick_matches/123");

    const matchSnapshot = await docRef.set(matchData);

    console.log(matchSnapshot);

    return response(res, StatusCodes.ACCEPTED, true, matchSnapshot, null);
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
