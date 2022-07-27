const { Router } = require("express");
const { getRandomCaptains } = require("../controllers/player.controller");

const router = Router();

router.get("/get-random-captains", getRandomCaptains);

module.exports = router;
