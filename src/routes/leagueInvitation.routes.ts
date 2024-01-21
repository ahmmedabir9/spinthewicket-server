import { Router } from 'express';
import { createLeagueInvitation, getUserInvitations, getLeagueInvitations, rejectLeagueInvitation } from '../controllers/leagueInvitation.controller';

const router = Router();

//api: url/league/__
router.post('/create', createLeagueInvitation);
router.get('/user-invitations/:user', getUserInvitations);
router.get('/league-invitations/:league', getLeagueInvitations);
router.post('/reject/:id', rejectLeagueInvitation);

export default router;
