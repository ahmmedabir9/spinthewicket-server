const { StatusCodes } = require("http-status-codes");
const { League } = require("../models/League.model");
const { response } = require("../utils/response");
const { v4: uuidv4 } = require("uuid");
const { LeagueInvitation } = require("../models/LeagueInvitation.model");

// create a league
const createLeagueInvitation = async (req, res) => {
  const { invitedBy, invitedTo } = req.body;

  if (!invitedBy || !invitedTo) {
    let msg = "provide all informations!";
    return response(res, StatusCodes.BAD_REQUEST, false, {}, msg);
  }

  try {
    const leagueInvitation = await LeagueInvitation.create({
      invitedBy,
      invitedTo,
    });

    if (!leagueInvitation) {
      let msg = "could not create league invitation!";
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    return response(res, StatusCodes.ACCEPTED, true, { leagueInvitation: leagueInvitation }, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

//reject invitation
const rejectLeagueInvitation = async (req, res) => {
  const { id } = req.params;

  try {
    const leagueInvitation = await LeagueInvitation.findByIdAndDelete(id);

    if (!leagueInvitation) {
      let msg = "could not reject league invitation!";
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    return response(res, StatusCodes.OK, true, { leagueInvitation: leagueInvitation }, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

//get users invitations
const getUserInvitations = async (req, res) => {
  const { user } = req.params;

  if (!user) {
    let msg = "provide userID!";
    return response(res, StatusCodes.BAD_REQUEST, false, {}, msg);
  }

  try {
    const leagueInvitations = await LeagueInvitation.find({
      invitedTo: user,
    })
      .select("invitedBy createdAt")
      .sort({ createdAt: -1 })
      .populate([
        {
          path: "invitedBy",
          select: "title shortName country slug logo xp level",
        },
      ]);

    if (!leagueInvitations || leagueInvitations.length === 0) {
      let msg = "no invitations found!";
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    return response(res, StatusCodes.OK, true, { leagueInvitations: leagueInvitations }, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

//get league invitations
const getLeagueInvitations = async (req, res) => {
  const { league } = req.params;

  if (!league) {
    let msg = "provide leagueID!";
    return response(res, StatusCodes.BAD_REQUEST, false, {}, msg);
  }

  try {
    const leagueInvitations = await LeagueInvitation.find({
      invitedBy: league,
    })
      .select("invitedTo createdAt")
      .sort({ createdAt: -1 })
      .populate([
        {
          path: "invitedTo",
          select: "name photo",
        },
      ]);

    if (!leagueInvitations || leagueInvitations.length === 0) {
      let msg = "no invitations found!";
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    return response(res, StatusCodes.OK, true, { leagueInvitations: leagueInvitations }, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

module.exports = {
  createLeagueInvitation,
  rejectLeagueInvitation,
  getUserInvitations,
  getLeagueInvitations,
};
