const { Router } = require("express");
const {
  startQuickMatch,
  playQuickMatch,
} = require("../controllers/quickMatch.controller");

const router = Router();

//api: url/league-team/__
router.post("/start-quick-match", startQuickMatch);
router.post("/play-quick-match", playQuickMatch);

module.exports = router;
