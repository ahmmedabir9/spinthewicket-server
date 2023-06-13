import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { League } from '../models/League.model';
import { _ILeague_ } from '../models/_ModelTypes_';
import { response } from '../utils/response';

// create a league
const createLeague = async (req: Request, res: Response) => {
  const { title, shortName, country, manager, logo, coverPhoto } = req.body;

  if (!title || !shortName || !manager || !logo) {
    let msg = 'Provide all information!';
    return response(res, StatusCodes.BAD_REQUEST, false, {}, msg);
  }

  try {
    let slug = title.replace(/\s+/g, '-').replace(/\//g, '-').replace(/&/g, 'n').toLowerCase();

    const oldSlug: _ILeague_ | null = await League.findOne({ slug }).select('_id');

    if (oldSlug) {
      const leaguesCount: number = await League.countDocuments();

      slug = slug + '-' + leaguesCount.toString();
    }

    const league: _ILeague_ | null = await League.create({
      title,
      shortName,
      slug,
      country,
      managers: [manager],
      logo,
      coverPhoto,
      xp: 0,
      level: 0,
    });

    if (!league) {
      let msg = 'Could not create league!';
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    return response(res, StatusCodes.ACCEPTED, true, { league }, null);
  } catch (error: any) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

//update league
const updateLeague = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    let league: any = {};

    if (title) {
      league.title = title;
      league.slug = title.replace(/\s+/g, '-').replace(/\//g, '-').replace(/&/g, 'n').toLowerCase();

      const oldSlug = await League.findOne({ slug: league.slug }).select('_id');

      if (oldSlug) {
        const leaguesCount = await League.countDocuments();

        league.slug = league.slug + '-' + leaguesCount.toString();
      }
    }

    const newLeague = await League.findByIdAndUpdate(
      id,
      { ...req.body, ...league },
      {
        new: true,
      },
    ).populate('managers', 'name photo');

    if (!newLeague) {
      let msg = 'could not update league!';
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    return response(res, StatusCodes.ACCEPTED, true, { league: newLeague }, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

//get all leagues
const getAllLeagues = async (req: Request, res: Response) => {
  const { skip, limit, sortBy, searchKey, country, manager } = req.body;

  try {
    const query = League.find();

    if (searchKey) {
      query.or([
        { title: { $regex: searchKey, $options: 'i' } },
        { shortName: { $regex: searchKey, $options: 'i' } },
      ]);
    }

    if (country) {
      query.where({ country });
    }

    if (manager) {
      query.where({ managers: manager });
    }

    query
      .sort(sortBy ? { [sortBy.field]: [sortBy.order] } : { xp: 1 })
      .limit(limit ? limit : undefined)
      .skip(skip ? skip : undefined)
      .select('title shortName country slug logo xp level')
      .populate({
        path: 'country',
        select: 'name code',
      });

    const leagues: _ILeague_[] = await query;

    if (!leagues || leagues.length === 0) {
      let msg = 'No leagues found!';
      return response(res, StatusCodes.NOT_FOUND, false, null, msg);
    }

    return response(res, StatusCodes.OK, true, { leagues }, null);
  } catch (error: any) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

//get league details
const getLeagueDetails = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const league: _ILeague_ | null = await League.findOne({ slug }).populate([
      {
        path: 'country',
        select: 'name code',
      },
      {
        path: 'managers',
        select: 'name photo',
      },
    ]);

    if (!league) {
      let msg = 'No league found!';
      return response(res, StatusCodes.NOT_FOUND, false, null, msg);
    }

    return response(res, StatusCodes.OK, true, { league }, null);
  } catch (error: any) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

//delete league
const deleteLeague = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const league = await League.findByIdAndDelete(id);
    if (!league) {
      let msg = 'Could not delete!';
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    // Delete photos here

    return response(res, StatusCodes.OK, true, { league: { _id: league._id } }, null);
  } catch (error: any) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

export { createLeague, updateLeague, getAllLeagues, getLeagueDetails, deleteLeague };
