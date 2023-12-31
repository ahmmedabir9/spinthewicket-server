const { Router } = require('express');
const { startQuickMatch, getMatchData } = require('../controllers/dreamTeamMatch.controller');

const router = Router();

//api: url/league-team/__
router.post('/start-quick-match', startQuickMatch);
router.get('/get-match-data/:id', getMatchData);

module.exports = router;
