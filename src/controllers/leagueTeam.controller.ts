import { StatusCodes } from 'http-status-codes';
import { League } from '../models/League.model';
import { LeagueInvitation } from '../models/LeagueInvitation.model';
import { response } from '../utils/response';
import { v4 as uuidv4 } from 'uuid';
import { LeagueTeam } from '../models/LeagueTeam.model';

// create a league
const createLeagueTeam = async (req, res) => {
  const { title, shortName, manager, logo, league } = req.body;

  if (!title || !shortName || !manager || !league) {
    const msg = 'provide all informations!';
    return response(res, StatusCodes.BAD_REQUEST, false, {}, msg);
  }

  try {
    //check user is manager

    const newLeague: any = await League.findById(league).select('managers');

    if (!newLeague) {
      const msg = 'no league found!';
      return response(res, StatusCodes.NOT_FOUND, false, {}, msg);
    }

    if (!newLeague?.managers?.include(manager)) {
      //if not manager check the invitation
      const invitation = await LeagueInvitation.findOne({
        invitedTo: manager,
        invitedBy: newLeague,
      });

      if (!invitation) {
        const msg = 'You do not have invitation to create team in this league!';
        return response(res, StatusCodes.FORBIDDEN, false, {}, msg);
      }
    }

    const slug = title.replace(/\s+/g, '-').replace(/\//g, '-').replace(/&/g, 'n').toLowerCase() + '-' + +uuidv4();

    const leagueTeam = await LeagueTeam.create({
      title,
      shortName,
      slug,
      manager,
      logo,
      xp: 0,
      level: 0,
      isActive: true,
      balance: 1000000,
      achivements: [],
      trophies: [],
    });

    if (!leagueTeam) {
      const msg = 'could not create league!';
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    return response(res, StatusCodes.ACCEPTED, true, { leagueTeam: leagueTeam }, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

//update league team
const updateLeagueTeam = async (req, res) => {
  const { title, manager, shortName, logo, captain } = req.body;

  const { id } = req.params;

  try {
    const leagueTeam: any = {};

    if (title) leagueTeam.title = title;
    if (manager) leagueTeam.manager = manager;
    if (shortName) leagueTeam.shortName = shortName;
    if (logo) leagueTeam.logo = logo;
    if (captain) leagueTeam.captain = captain;

    const updatedLeagueTeam = await LeagueTeam.findByIdAndUpdate(id, leagueTeam).populate('captain manager');

    if (!updatedLeagueTeam) {
      const msg = 'could not update team!';
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    return response(res, StatusCodes.ACCEPTED, true, { leagueTeam: updatedLeagueTeam }, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

//update league team status
const updateLeagueTeamStatus = async (req, res) => {
  const { isActive } = req.body;

  const { id } = req.params;

  try {
    const leagueTeam: any = {};

    if (isActive !== undefined) leagueTeam.isActive = isActive;

    const updatedLeagueTeam = await LeagueTeam.findByIdAndUpdate(id, leagueTeam).populate([
      {
        path: 'captain',
        select: 'playerID playerInfo',
        populate: {
          path: 'playerInfo',
          select: 'name role photo rating',
        },
      },
      {
        path: 'managers',
        select: 'name photo',
      },
    ]);

    if (!updatedLeagueTeam) {
      const msg = 'could not update team status!';
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    return response(res, StatusCodes.ACCEPTED, true, { leagueTeam: updatedLeagueTeam }, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

//get all league team
const getAllLeagueTeams = async (req, res) => {
  const { id } = req.params;

  try {
    const leagueTeams = await LeagueTeam.find({ league: id }).select('title shortName slug logo xp level points balance matches');

    if (!leagueTeams || leagueTeams.length === 0) {
      const msg = 'no team found!';
      return response(res, StatusCodes.NOT_FOUND, false, null, msg);
    }

    return response(res, StatusCodes.OK, true, { leagueTeams: leagueTeams }, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

//get league team details
const getLeagueTeamDetails = async (req, res) => {
  const { slug } = req.params;

  try {
    const leagueTeam = await League.findOne({ slug: slug }).populate([
      {
        path: 'captain',
        select: 'playerID playerInfo',
        populate: {
          path: 'playerInfo',
          select: 'name role photo rating',
        },
      },
      {
        path: 'managers',
        select: 'name photo',
      },
    ]);

    if (!leagueTeam) {
      const msg = 'no team found!';
      return response(res, StatusCodes.NOT_FOUND, false, null, msg);
    }

    return response(res, StatusCodes.OK, true, { leagueTeam: leagueTeam }, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

//delete league team
const deleteLeagueTeam = async (req, res) => {
  const { id } = req.params;

  try {
    const leagueTeam = await LeagueTeam.findByIdAndDelete(id);

    if (!leagueTeam) {
      const msg = 'could not delete team!';
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    return response(res, StatusCodes.ACCEPTED, true, { leagueTeam: leagueTeam }, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

export { createLeagueTeam, updateLeagueTeam, updateLeagueTeamStatus, getAllLeagueTeams, getLeagueTeamDetails, deleteLeagueTeam };
