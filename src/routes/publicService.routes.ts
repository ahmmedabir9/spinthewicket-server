import express from 'express';
import { updateAllPlayerOvr, updateAllTeamOvr } from '../services/playerCreator';

const router = express.Router();

router.post('/update-all-player-ovr', updateAllPlayerOvr);
router.post('/update-all-team-ovr', updateAllTeamOvr);

export default router;
