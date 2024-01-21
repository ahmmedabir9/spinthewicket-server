import { Request, Response } from 'express';

const { StatusCodes } = require('http-status-codes');
const { Theme } = require('../models/Theme.model');
const { response } = require('../utils/response');

const getAllThemes = async (req: Request, res: Response) => {
  const { themeType } = req.query;

  try {
    const query = themeType ? { themeType: themeType.toString() } : {};

    const themes = await Theme.find(query);

    if (!themes || themes.length === 0) {
      const msg = 'No themes found!';
      return response(res, StatusCodes.NOT_FOUND, false, null, msg);
    }

    return response(res, StatusCodes.OK, true, themes, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

export { getAllThemes };
