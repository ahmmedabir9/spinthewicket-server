const { Router } = require("express");
const {
  createDreamTeam,
  getUserDreamTeam,
  updateTeam,
  getDreamTeamById,
  getDreamTeamSquad,
  createBotTeam,
} = require("../controllers/dreamTeam.controller");

const router = Router();

//api: url/league-team/__
router.post("/create", createDreamTeam);
router.post("/create-bot-team", createBotTeam);
router.get("/user-team/:id", getUserDreamTeam);
router.get("/team-by-id/:id", getDreamTeamById);
router.get("/squad/:id", getDreamTeamSquad);
router.put("/update-team/:id", updateTeam);

module.exports = router;
