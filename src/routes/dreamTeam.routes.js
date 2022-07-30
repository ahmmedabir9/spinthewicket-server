const { Router } = require("express");
const {
  createDreamTeam,
  getUserDreamTeam,
} = require("../controllers/dreamTeam.controller");

const router = Router();

//api: url/league-team/__
router.post("/create", createDreamTeam);
router.get("/user-team/:id", getUserDreamTeam);

module.exports = router;
