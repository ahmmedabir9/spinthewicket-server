const { Router } = require('express');
const {
  startQuickMatch,
  playQuickMatch,
  getMatchData,
} = require('../controllers/dreamTeamMatch.controller');

const router = Router();

//api: url/league-team/__
router.post('/start-quick-match', startQuickMatch);
router.post('/play-quick-match', playQuickMatch);
router.get('/get-match-data/:id', getMatchData);

module.exports = router;
