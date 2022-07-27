const { StatusCodes } = require("http-status-codes");
const { Theme } = require("../models/Theme.model");
const { response } = require("../utils/response");

const getAllThemes = async (req, res) => {
  const { themeType } = req.body;

  try {
    const themes = await Theme.find().where(
      themeType ? { themeType: themeType } : null
    );

    if (!themes || themes.length === 0) {
      let msg = "no themes found!";
      return response(res, StatusCodes.NOT_FOUND, false, null, msg);
    }

    return response(res, StatusCodes.OK, true, themes, null);
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

module.exports = { getAllThemes };
