const { StatusCodes } = require("http-status-codes");
const { DreamTeam } = require("../models/DreamTeam.model");
const { response } = require("../utils/response");

const createDreamTeam = async (req, res) => {
  const { title, code, theme, manager, captain } = req.body;

  if (!title || !code || !manager || !theme || !captain) {
    let msg = "provide all informations!";
    return response(res, StatusCodes.BAD_REQUEST, false, {}, msg);
  }

  try {
    var teamId = title
      .replace(/\s+/g, "-")
      .replace(/\//g, "-")
      .replace(/&/g, "n")
      .toLowerCase();

    const oldTeam = await DreamTeam.findOne({ teamId: teamId }).select("_id");

    if (oldTeam) {
      const teamCount = await DreamTeam.countDocuments();

      teamId = teamId + "-" + teamCount.toString();
    }

    const team = await DreamTeam.create({
      title,
      code,
      teamId,
      country,
      theme,
      manager,
      xp: 0,
      level: 0,
      trophies: [],
      achivements: [],
    });

    if (!team) {
      let msg = "could not create team!";
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    return response(res, StatusCodes.ACCEPTED, true, { team: team }, null);
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
