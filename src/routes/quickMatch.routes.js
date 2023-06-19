const { Router } = require('express');
const { startQuickMatch } = require('../controllers/dreamTeamMatch.controller');

const router = Router();

//api: url/league-team/__
router.post('/start-quick-match', startQuickMatch);

module.exports = router;
