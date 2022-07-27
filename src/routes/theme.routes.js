const { Router } = require("express");
const { getAllThemes } = require("../controllers/theme.controller");

const router = Router();

//api: url/league/__
router.post("/all", getAllThemes);

module.exports = router;
