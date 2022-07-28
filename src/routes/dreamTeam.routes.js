const { Router } = require("express");
const { createDreamTeam } = require("../controllers/dreamTeam.controller");

const router = Router();

//api: url/league-team/__
router.post("/create", createDreamTeam);

module.exports = router;
