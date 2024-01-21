import express from 'express';
import { getAllThemes } from '../controllers/theme.controller';
// import { getAllThemes } from '../controllers/theme.controller';

const router = express.Router();

//api: url/league/__
router.post('/all', getAllThemes);

export default router;
