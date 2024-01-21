import express from 'express';
import { getRandomCaptains } from '../controllers/player.controller';

const router = express.Router();

router.get('/get-random-captains', getRandomCaptains);

export default router;
