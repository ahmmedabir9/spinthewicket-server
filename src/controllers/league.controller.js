const { StatusCodes } = require("http-status-codes");
const { League } = require("../models/League.model");
const { response } = require("../utils/response");
const { v4: uuidv4 } = require("uuid");

// create a league
const createLeague = async (req, res) => {
  const { title, shortName, country, manager, logo, coverPhoto } = req.body;

  if (!title || !shortName || !manager || !logo) {
    let msg = "provide all informations!";
    return response(res, StatusCodes.BAD_REQUEST, false, {}, msg);
  }

  try {
    var slug = title
      .replace(/\s+/g, "-")
      .replace(/\//g, "-")
      .replace(/&/g, "n")
      .toLowerCase();

    const oldSlug = await League.findOne({ slug: slug }).select("_id");

    if (oldSlug) {
      const leaguesCount = await League.countDocuments();

      slug = slug + "-" + leaguesCount.toString();
    }

    const league = await League.create({
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
      let msg = "could not create league!";
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    return response(res, StatusCodes.ACCEPTED, true, { league: league }, null);
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

//update league
const updateLeague = async (req, res) => {
  const { id } = req.params;
  const { title, shortName, country, managers, logo, coverPhoto } = req.body;

  try {
    let league = {};

    if (title) {
      league.title = title;
      league.slug = title
        .replace(/\s+/g, "-")
        .replace(/\//g, "-")
        .replace(/&/g, "n")
        .toLowerCase();

      const oldSlug = await League.findOne({ slug: league.slug }).select("_id");

      if (oldSlug) {
        const leaguesCount = await League.countDocuments();

        league.slug = league.slug + "-" + leaguesCount.toString();
      }
    }
    if (shortName) {
      league.shortName = shortName;
    }
    if (country) {
      league.country = country;
    }
    if (managers) {
      league.managers = managers;
    }
    if (logo) {
      league.logo = logo;
    }
    if (coverPhoto) {
      league.coverPhoto = coverPhoto;
    }

    const newLeague = await League.findByIdAndUpdate(id, league, {
      new: true,
    }).populate("managers", "name photo");

    if (!newLeague) {
      let msg = "could not update league!";
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { league: newLeague },
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

//get all leagues
const getAllLeagues = async (req, res) => {
  const { skip, limit, sortBy, searchKey, country, manager } = req.body;

  try {
    const leagues = await League.find()
      .where(
        searchKey
          ? {
              $or: [
                {
                  title: { $regex: searchKey, $options: "i" },
                },
                {
                  shortName: { $regex: searchKey, $options: "i" },
                },
              ],
            }
          : null
      )
      .where(country ? { country: country } : null)
      .where(manager ? { managers: manager } : null)
      .sort(sortBy ? { [sortBy.field]: [sortBy.order] } : { xp: 1 })
      .limit(limit ? limit : null)
      .skip(skip ? skip : null)
      .select("title shortName country slug logo xp level")
      .populate({
        path: "country",
        select: "name code",
      });

    if (!leagues || leagues.length === 0) {
      let msg = "no league found!";
      return response(res, StatusCodes.NOT_FOUND, false, null, msg);
    }

    return response(res, StatusCodes.OK, true, { leagues: leagues }, null);
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

//get league details
const getLeagueDetails = async (req, res) => {
  const { slug } = req.params;

  try {
    const league = await League.findOne({ slug: slug }).populate([
      {
        path: "country",
        select: "name code",
      },
      {
        path: "managers",
        select: "name photo",
      },
    ]);

    if (!league) {
      let msg = "no league found!";
      return response(res, StatusCodes.NOT_FOUND, false, null, msg);
    }

    return response(res, StatusCodes.OK, true, { league: league }, null);
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

//delete league
const deleteLeague = async (req, res) => {
  const { id } = req.params;

  try {
    const league = League.findByIdAndDelete(id);
    if (!league) {
      let msg = "could not delete!";
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    //delete photos here

    return response(
      res,
      StatusCodes.OK,
      true,
      { league: { _id: league._id } },
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

module.exports = {
  createLeague,
  updateLeague,
  getAllLeagues,
  getLeagueDetails,
  deleteLeague,
};
