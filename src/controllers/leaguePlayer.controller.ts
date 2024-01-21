import { StatusCodes } from 'http-status-codes';
import BattingStat from '../models/BattingStat.model';
import BowlingStat from '../models/BowlingStat.model';
import { LeaguePlayer } from '../models/LeaguePlayer.model';
import { PlayerInfo } from '../models/PlayerInfo.model';
import { response } from '../utils/response';

//add player to league
const addPlayerToLeague = async (req, res) => {
  const { playerID, leagueID } = req.body;

  if (!playerID || !leagueID) {
    const msg = 'provide all informations!';
    return response(res, StatusCodes.BAD_REQUEST, false, {}, msg);
  }

  try {
    const leaguePlayer = await createLeaguePlayer(playerID, leagueID);

    if (!leaguePlayer) {
      const msg = 'could not create league player!';
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    return response(res, StatusCodes.ACCEPTED, true, { leaguePlayer: leaguePlayer }, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
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
    }).select('playerID');

    if (oldPlayer) {
      return false;
    }

    const playerInfo: any = await PlayerInfo.findOne({ playerID: playerID });

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
    return error;
  }
};

export { addPlayerToLeague };
