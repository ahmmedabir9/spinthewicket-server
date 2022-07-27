const { Router } = require("express");
const {
  createLeagueTeam,
  getAllLeagueTeams,
  updateLeagueTeam,
  updateLeagueTeamStatus,
  deleteLeagueTeam,
  getLeagueTeamDetails,
} = require("../controllers/leagueTeam.controller");

const router = Router();

//api: url/league-team/__
router.post("/create", createLeagueTeam);
router.get("/all-teams/:id", getAllLeagueTeams);
router.put("/update/:id", updateLeagueTeam);
router.put("/update-status/:id", updateLeagueTeamStatus);
router.get("/details/:slug", getLeagueTeamDetails);
router.post("/delete/:id", deleteLeagueTeam);

module.exports = router;
