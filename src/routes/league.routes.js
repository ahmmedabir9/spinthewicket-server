const { Router } = require("express");
const {
  createLeague,
  getAllLeagues,
  updateLeague,
  getLeagueDetails,
} = require("../controllers/league.controller");

const router = Router();

//api: url/league/__
router.post("/create", createLeague);
router.post("/all-league", getAllLeagues);
router.put("/update/:id", updateLeague);
router.get("/details/:slug", getLeagueDetails);

module.exports = router;
