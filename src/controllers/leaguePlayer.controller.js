const { StatusCodes } = require("http-status-codes");
const { BattingStat } = require("../models/BattingStat.model");
const { BowlingStat } = require("../models/BowlingStat.model");
const { League } = require("../models/League.model");
const { LeaguePlayer } = require("../models/LeaguePlayer.model");
const { PlayerInfo } = require("../models/PlayerInfo.model");
const { createLeagueTeam } = require("./leagueTeam.controller");

//add player to league
const addPlayerToLeague = async (req, res) => {
  const { playerID, leagueID } = req.body;

  if (!playerID || !leagueID) {
    let msg = "provide all informations!";
    return response(res, StatusCodes.BAD_REQUEST, false, {}, msg);
  }

  try {
    const leaguePlayer = await createLeaguePlayer(playerID, leagueID);

    if (!leaguePlayer) {
      let msg = "could not create league player!";
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { leaguePlayer: leaguePlayer },
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

//add players by filter

//add player to team

//get league players

//get player details

const createLeaguePlayer = async (playerID, leagueID) => {
  try {
    const oldPlayer = await LeaguePlayer.findOne({
      playerID: playerID,
      league: leagueID,
    }).select("playerID");

    if (oldPlayer) {
      return false;
    }

    const playerInfo = await PlayerInfo.findOne({ playerID: PlayerID });

    if (!playerInfo) {
      return false;
    }

    const battingStat = await BattingStat.create({});
    const bowlingStat = await BowlingStat.create({});

    const leaguePlayer = await LeaguePlayer.create({
      playerID: playerInfo.playerID,
      activePlayer: true,
      league: leagueID,
      playerInfo: playerInfo?._id,
      achivements: [],
      trophies: [],
      battingStat: battingStat?._id,
      bowlingStat: bowlingStat?._id,
    });

    if (!leaguePlayer) {
      return false;
    }
    return leaguePlayer;
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

module.exports = { addPlayerToLeague };
