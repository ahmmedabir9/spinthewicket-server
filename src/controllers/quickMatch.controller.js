const { StatusCodes } = require("http-status-codes");
const { DreamTeam } = require("../models/DreamTeam.model");
const { response } = require("../utils/response");

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

const createQuickMatch = async (req, res) => {
  try {
    const { team, overs, user } = req.body;

    if (!team || !overs || !user) {
      let msg = "provide all informations!";
      return response(res, StatusCodes.BAD_REQUEST, false, {}, msg);
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
        team: dreamTeam?._id,
      };
    } else {
      const choosen = Math.floor(Math.random() * 10000) % 2;
      toss = {
        team: opponentTeam?._id,
        selected: choosen === 0 ? "bat" : "bowl",
      };
    }

    const matchData = {
      type: "quick",
      teams: { a: dreamTeam?._id, b: opponentTeam?._id },
      scorers: { a: user, b: null },
      overs: parseInt(overs),
      status: toss.team === dreamTeam?._id ? "toss" : "live",
      createdAt: new Date(),
      playingXI: {
        [dreamTeam?._id]: dreamTeam?.playingXI?.map((player) => player?._id),
        [opponentTeam?._id]: opponentTeam?.playingXI?.map(
          (player) => player?._id
        ),
      },
      ready: { a: false, b: true },
      users: [user],
    };

    //save match data
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
