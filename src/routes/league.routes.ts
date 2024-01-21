import { Router } from 'express';
import { createLeague, getAllLeagues, updateLeague, getLeagueDetails } from '../controllers/league.controller';

const router = Router();

//api: url/league/__
router.post('/create', createLeague);
router.post('/all-league', getAllLeagues);
router.put('/update/:id', updateLeague);
router.get('/details/:slug', getLeagueDetails);

export default router;
