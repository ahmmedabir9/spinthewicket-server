const { StatusCodes } = require("http-status-codes");
const { DreamPlayer } = require("../models/DreamPlayer.model");
const { DreamTeam } = require("../models/DreamTeam.model");
const { PlayerInfo } = require("../models/PlayerInfo.model");
const { initialPlayerData, initialTeamData } = require("../utils/constants");
const { response } = require("../utils/response");
const { shufflePlayers } = require("./player.controller");

const teamPopulate = [
  { path: "theme" },
  { path: "manager" },
  {
    path: "captaian",
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

const playerPopulate = [
  {
    path: "playerInfo",
  },
];

const createDreamTeam = async (req, res) => {
  const { title, code, theme, manager, captain } = req.body;

  if (!title || !code || !manager || !theme || !captain) {
    let msg = "provide all informations!";
    return response(res, StatusCodes.BAD_REQUEST, false, {}, msg);
  }

  try {
    var teamId = title.replace(/\s+/g, "").replace(/\//g, "").toLowerCase();

    const oldTeam = await DreamTeam.findOne({ teamId: teamId }).select("_id");

    if (oldTeam) {
      const teamCount = await DreamTeam.countDocuments();

      teamId = teamId + teamCount.toString();
    }

    const team = await DreamTeam.create({
      title,
      code,
      teamId,
      theme,
      manager,
      ...initialTeamData,
    });

    if (!team) {
      let msg = "could not create team!";
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    const captainPlayer = await createSquad(captain, team?._id);

    const squad = await DreamPlayer.find({ team: team?._id }).populate(
      playerPopulate
    );

    const playingXI = await createPlayingXI(squad);

    const teamRating = await calculateTeamRating(playingXI);

    const newTeam = await DreamTeam.findByIdAndUpdate(
      team?._id,
      {
        rating: teamRating,
        captain: captainPlayer,
        playigXI: playingXI.map((item) => item._id),
      },
      { new: true }
    ).populate(teamPopulate);

    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { team: newTeam, squad },
      null
    );
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

const getUserDreamTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const dreamTeam = await DreamTeam.findOne({ manager: id }).populate(
      teamPopulate
    );

    if (!dreamTeam) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        null,
        "You Do not Have Dream Team!"
      );
    }

    const dreamPlayers = await DreamPlayer.find({
      team: dreamTeam?._id,
    }).populate(playerPopulate);

    return response(
      res,
      StatusCodes.OK,
      true,
      { dreamTeam, dreamPlayers },
      null
    );
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

const getDreamTeamById = async (req, res) => {
  try {
    const { id } = req.params;

    const dreamTeam = await DreamTeam.findById(id).populate(teamPopulate);

    if (!dreamTeam) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        null,
        "No Team Found!"
      );
    }

    return response(res, StatusCodes.OK, true, dreamTeam, null);
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

const getDreamTeamSquad = async (req, res) => {
  try {
    const { id } = req.params;

    const dreamPlayers = await DreamPlayer.find({ team: id }).populate(
      playerPopulate
    );

    if (!dreamPlayers || dreamPlayers?.length === 0) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        null,
        "No Players Found!"
      );
    }

    return response(res, StatusCodes.OK, true, dreamPlayers, null);
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

const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const { playingXI, title, code, captain, theme, rating } = req.body;

    let dataToUpdate = {};

    if (title) {
      var teamId = title.replace(/\s+/g, "").replace(/\//g, "").toLowerCase();

      const oldTeam = await DreamTeam.findOne({ teamId: teamId }).select("_id");

      if (oldTeam) {
        const teamCount = await DreamTeam.countDocuments();

        teamId = teamId + "-" + teamCount.toString();
      }

      dataToUpdate.title = title;
      dataToUpdate.teamId = teamId;
    }

    if (code) dataToUpdate.code = code;
    if (captain) dataToUpdate.captain = captain;
    if (theme) dataToUpdate.theme = theme;
    if (playingXI) dataToUpdate.playingXI = playingXI;
    if (rating) dataToUpdate.rating = rating;

    const dreamTeam = await DreamTeam.findByIdAndUpdate(id, dataToUpdate, {
      new: true,
    }).populate(teamPopulate);

    if (!dreamTeam) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        null,
        "Could Not Update Squad!"
      );
    }

    return response(res, StatusCodes.OK, true, dreamTeam, null);
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

const createSquad = async (captain, team) => {
  try {
    let allrounders = await PlayerInfo.find({
      _id: { $ne: captain },
      role: "All-Rounder",
    })
      .where({
        bowlingLevel: { $gte: 50 },
      })
      .where({
        bowlingLevel: { $lte: 75 },
      })
      .where({
        battingLevel: { $gte: 50 },
      })
      .where({
        battingLevel: { $lte: 75 },
      })
      .select("_id");

    let batsmen = await PlayerInfo.find({
      _id: { $ne: captain },
      role: "Batsman",
    })
      .where({
        battingLevel: { $gte: 60 },
      })
      .where({
        battingLevel: { $lte: 80 },
      })
      .select("_id");

    let keepers = await PlayerInfo.find({
      _id: { $ne: captain },
      role: "Wicket-Keeper",
    })
      .where({
        battingLevel: { $gte: 60 },
      })
      .where({
        battingLevel: { $lte: 80 },
      })
      .select("_id");

    let bowlers = await PlayerInfo.find({
      _id: { $ne: captain },
      role: "Bowler",
    })
      .where({
        bowlingLevel: { $gte: 60 },
      })
      .where({
        bowlingLevel: { $lte: 80 },
      })
      .select("_id");

    shufflePlayers(allrounders);
    shufflePlayers(batsmen);
    shufflePlayers(bowlers);
    shufflePlayers(keepers);

    const players = [
      ...batsmen.slice(0, 5),
      ...allrounders.slice(0, 4),
      ...bowlers.slice(0, 4),
      ...keepers.slice(0, 1),
    ].map((item) => item._id);

    const captainPlayer = await DreamPlayer.create({
      playerInfo: captain,
      team: team,
      ...initialPlayerData,
    });

    for (let index = 0; index < players.length; index++) {
      await DreamPlayer.create({
        playerInfo: players[index],
        team: team,
        ...initialPlayerData,
      });
    }

    return captainPlayer._id;
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

const createPlayingXI = async (squad) => {
  const bowlers = squad
    .sort((a, b) =>
      a.playerInfo?.bowlingLevel < b.playerInfo?.bowlingLevel ? 1 : -1
    )
    .slice(0, 5);

  const batsmen = squad
    .sort((a, b) =>
      a.playerInfo?.battingLevel < b.playerInfo?.battingLevel ? 1 : -1
    )
    .filter(
      (batsman) => !bowlers.find((bowler) => bowler?._id === batsman?._id)
    )
    .slice(0, 6);

  const playingXI = [...batsmen, ...bowlers].sort((a, b) =>
    a.playerInfo?.battingLevel < b.playerInfo?.battingLevel ? 1 : -1
  );

  return playingXI;
};

const calculateTeamRating = async (playingXI) => {
  let totalRating = 0;

  for (let index = 0; index < playingXI.length; index++) {
    const player = playingXI[index];
    totalRating =
      totalRating +
      (player.playerInfo?.battingLevel > player.playerInfo?.bowlingLevel
        ? player.playerInfo?.battingLevel
        : player.playerInfo?.bowlingLevel);
  }

  console.log(totalRating);
  return totalRating / 11;
};

module.exports = {
  createDreamTeam,
  getUserDreamTeam,
  getDreamTeamById,
  updateTeam,
  getDreamTeamSquad,
};
