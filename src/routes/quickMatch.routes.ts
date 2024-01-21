import { Router } from 'express';
import { startQuickMatch, getMatchData } from '../controllers/dreamTeamMatch.controller';

const router = Router();

//api: url/league-team/__
router.post('/start-quick-match', startQuickMatch);
router.get('/get-match-data/:id', getMatchData);

export default router;
