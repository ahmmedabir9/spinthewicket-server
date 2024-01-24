import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import BattingStat from '../models/BattingStat.model';
import BowlingStat from '../models/BowlingStat.model';
import { DreamPlayer } from '../models/DreamPlayer.model';
import { DreamTeam } from '../models/DreamTeam.model';
import { PlayerInfo } from '../models/PlayerInfo.model';
import { _IBattingStat_, _IBowlingStat_, _IDreamPlayer_, _IDreamTeam_, _IPlayerInfo_ } from '../models/_ModelTypes_';
import { addPlayers } from '../services/playerCreator';
import { initialBattingStat, initialBowlingStat, initialPlayerData, initialTeamData } from '../utils/constants';
import { response } from '../utils/response';
import { shufflePlayers } from '../utils/utilities';

const teamPopulate = [
  { path: 'theme' },
  { path: 'manager' },
  {
    path: 'captain',
    populate: {
      path: 'playerInfo',
    },
  },
  {
    path: 'playingXI',
    populate: {
      path: 'playerInfo',
    },
  },
];

const createDreamTeam = async (req: Request, res: Response) => {
  const { title, code, theme, manager, captain } = req.body;

  if (!title || !code || !manager || !theme || !captain) {
    const msg = 'Provide all information!';
    return response(res, StatusCodes.BAD_REQUEST, false, {}, msg);
  }

  try {
    let teamId = title.replace(/\s+/g, '').replace(/\//g, '').toLowerCase();

    const oldTeam: _IDreamTeam_ | null = await DreamTeam.findOne({ teamId }).select('_id');

    if (oldTeam) {
      const teamCount = await DreamTeam.countDocuments();

      teamId = teamId + teamCount.toString();
    }

    const team: _IDreamTeam_ | null = await DreamTeam.create({
      title,
      code,
      teamId,
      theme,
      manager,
      ...initialTeamData,
    });

    if (!team) {
      const msg = 'Could not create team!';
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    const captainPlayer: _IDreamPlayer_ | null = await createDreamSquad(captain, team?._id);

    const squad: _IDreamPlayer_[] = await DreamPlayer.find({ team: team?._id }).populate('playerInfo');

    const playingXI: any = await createPlayingXI(squad);

    const teamOvr: number = await calculateTeamOvr(playingXI);

    const newTeam: _IDreamTeam_ | null = await DreamTeam.findByIdAndUpdate(
      team?._id,
      {
        ovr: teamOvr,
        captain: captainPlayer?._id,
        playingXI: playingXI.map((item) => item._id),
      },
      { new: true },
    )
      .populate('captain')
      .populate('playingXI');

    return response(res, StatusCodes.ACCEPTED, true, { team: newTeam, squad }, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

const getUserDreamTeam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const dreamTeam: _IDreamTeam_ | null = await DreamTeam.findOne({ manager: id }).populate([
      { path: 'manager theme captain' },
      {
        path: 'playingXI',
        populate: 'playerInfo',
      },
    ]);

    if (!dreamTeam) {
      return response(res, StatusCodes.NOT_FOUND, false, null, 'You Do not Have Dream Team!');
    }

    const dreamPlayers: _IDreamPlayer_[] = await DreamPlayer.find({
      team: dreamTeam?._id,
    }).populate('playerInfo');

    return response(res, StatusCodes.OK, true, { dreamTeam, dreamPlayers }, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

const getDreamTeamById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const dreamTeam: _IDreamTeam_ | null = await DreamTeam.findById(id).populate('manager theme captain playingXI');

    if (!dreamTeam) {
      return response(res, StatusCodes.NOT_FOUND, false, null, 'No Team Found!');
    }

    return response(res, StatusCodes.OK, true, dreamTeam, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

const getDreamTeamSquad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const dreamPlayers: _IDreamPlayer_[] = await DreamPlayer.find({ team: id }).populate('player');

    if (!dreamPlayers || dreamPlayers.length === 0) {
      return response(res, StatusCodes.NOT_FOUND, false, null, 'No Players Found!');
    }

    return response(res, StatusCodes.OK, true, dreamPlayers, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

const updateTeam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const dataToUpdate: Partial<_IDreamTeam_> = {};

    if (title) {
      let teamId = title.replace(/\s+/g, '').replace(/\//g, '').toLowerCase();

      const oldTeam = await DreamTeam.findOne({ teamId }).select('_id');

      if (oldTeam) {
        const teamCount = await DreamTeam.countDocuments();

        teamId = teamId + '-' + teamCount.toString();
      }

      dataToUpdate.title = title;
      dataToUpdate.teamId = teamId;
    }

    const dreamTeam: _IDreamTeam_ | null = await DreamTeam.findByIdAndUpdate(id, dataToUpdate, {
      new: true,
    }).populate(teamPopulate);

    if (!dreamTeam) {
      return response(res, StatusCodes.NOT_FOUND, false, null, 'Could Not Update Squad!');
    }

    return response(res, StatusCodes.OK, true, dreamTeam, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

const createBotTeam = async (req: Request, res: Response) => {
  const { title, code, theme, captain, rating } = req.body;

  if (!title || !code || !theme || !captain || !rating) {
    const msg = 'Provide all information!';
    return response(res, StatusCodes.BAD_REQUEST, false, {}, msg);
  }

  try {
    let teamId = title.replace(/\s+/g, '').replace(/\//g, '').toLowerCase();

    const oldTeam: _IDreamTeam_ | null = await DreamTeam.findOne({ teamId }).select('_id');

    if (oldTeam) {
      const teamCount = await DreamTeam.countDocuments();

      teamId = teamId + teamCount.toString();
    }

    const team: _IDreamTeam_ | null = await DreamTeam.create({
      title,
      code,
      teamId,
      theme,
      isBot: true,
      ...initialTeamData,
    });

    if (!team) {
      const msg = 'Could not create team!';
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    const captainPlayer: _IDreamPlayer_ | null = await createDreamSquad(captain, team?._id, true, rating);

    const squad: _IDreamPlayer_[] = await DreamPlayer.find({ team: team?._id }).populate('player');

    const playingXI: any = await createPlayingXI(squad);

    const teamOvr: number = await calculateTeamOvr(playingXI);

    const newTeam: _IDreamTeam_ | null = await DreamTeam.findByIdAndUpdate(
      team?._id,
      {
        ovr: teamOvr,
        captain: captainPlayer?._id,
        playingXI: playingXI.map((item) => item._id),
      },
      { new: true },
    )
      .populate('captain')
      .populate('playingXI');

    return response(res, StatusCodes.ACCEPTED, true, { team: newTeam, squad }, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

const createDreamSquad = async (captain: string, team: string, isBot: boolean = false, rating?: number) => {
  try {
    let allrounders: _IPlayerInfo_[], batsmen: _IPlayerInfo_[], keepers: _IPlayerInfo_[], bowlers: _IPlayerInfo_[];

    if (isBot) {
      allrounders = await PlayerInfo.find({
        _id: { $ne: captain },
        role: 'All-Rounder',
        bowlingLevel: { $gte: rating - 20, $lte: rating + 5 },
        battingLevel: { $gte: rating - 20, $lte: rating + 5 },
      }).select('_id');

      batsmen = await PlayerInfo.find({
        _id: { $ne: captain },
        role: 'Batsman',
        battingLevel: { $gte: rating - 10, $lte: rating + 10 },
      }).select('_id');

      keepers = await PlayerInfo.find({
        _id: { $ne: captain },
        role: 'Wicket-Keeper',
        battingLevel: { $gte: rating - 10, $lte: rating + 10 },
      }).select('_id');

      bowlers = await PlayerInfo.find({
        _id: { $ne: captain },
        role: 'Bowler',
        bowlingLevel: { $gte: rating - 10, $lte: rating + 10 },
      }).select('_id');
    } else {
      allrounders = await PlayerInfo.find({
        _id: { $ne: captain },
        role: 'All-Rounder',
        bowlingLevel: { $gte: 75, $lte: 90 },
        battingLevel: { $gte: 75, $lte: 90 },
      }).select('_id');

      batsmen = await PlayerInfo.find({
        _id: { $ne: captain },
        role: 'Batsman',
        battingLevel: { $gte: 80, $lte: 95 },
      }).select('_id');

      keepers = await PlayerInfo.find({
        _id: { $ne: captain },
        role: 'Wicket-Keeper',
        battingLevel: { $gte: 80, $lte: 95 },
      }).select('_id');

      bowlers = await PlayerInfo.find({
        _id: { $ne: captain },
        role: 'Bowler',
        bowlingLevel: { $gte: 80, $lte: 95 },
      }).select('_id');
    }

    shufflePlayers(allrounders);
    shufflePlayers(batsmen);
    shufflePlayers(bowlers);
    shufflePlayers(keepers);

    const players = [...batsmen.slice(0, 5), ...allrounders.slice(0, 4), ...bowlers.slice(0, 4), ...keepers.slice(0, 1)].map((item) => item._id);

    const captainBattingStat: _IBattingStat_ = await BattingStat.create({
      ...initialBattingStat,
    });

    const captainBowlingStat: _IBowlingStat_ = await BowlingStat.create({
      ...initialBowlingStat,
    });

    const captainPlayer: _IDreamPlayer_ = await DreamPlayer.create({
      playerInfo: captain,
      team: team,
      isBot: isBot,
      battingStat: captainBattingStat?._id,
      bowlingStat: captainBowlingStat?._id,
      ...initialPlayerData,
    });

    for (let index = 0; index < players.length; index++) {
      const playerBattingStat: _IBattingStat_ = await BattingStat.create({
        ...initialBattingStat,
      });

      const playerBowlingStat: _IBowlingStat_ = await BowlingStat.create({
        ...initialBowlingStat,
      });

      await DreamPlayer.create({
        playerInfo: players[index],
        team: team,
        isBot: isBot,
        battingStat: playerBattingStat?._id,
        bowlingStat: playerBowlingStat?._id,
        ...initialPlayerData,
      });
    }

    return captainPlayer._id;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createPlayingXI = async (squad: _IDreamPlayer_[]) => {
  const bowlers = squad.sort((a, b) => (a.playerInfo.bowlingLevel < b.playerInfo.bowlingLevel ? 1 : -1)).slice(0, 5);

  const batsmen = squad
    .sort((a, b) => (a.playerInfo.battingLevel < b.playerInfo.battingLevel ? 1 : -1))
    .filter((batsman) => !bowlers.find((bowler) => bowler?._id === batsman?._id))
    .slice(0, 6);

  const playingXI = [...batsmen, ...bowlers].sort((a, b) => (a.playerInfo.battingLevel < b.playerInfo.battingLevel ? 1 : -1));

  return playingXI;
};

export const calculateTeamOvr = async (playingXI: _IDreamPlayer_[]): Promise<number> => {
  let totalRating = 0;

  for (let index = 0; index < playingXI.length; index++) {
    const player = playingXI[index];
    totalRating += player.playerInfo?.ovr;
  }

  return totalRating / 11;
};

export { createDreamTeam, getUserDreamTeam, getDreamTeamById, updateTeam, getDreamTeamSquad, createBotTeam };
