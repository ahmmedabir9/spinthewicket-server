const { Router } = require("express");
const {
  createUserProfile,
  getUserProfile,
  checkUsername,
} = require("../controllers/user.controller");

const router = Router();

//api: url/user/__
router.post("/create", createUserProfile);
router.get("/get-user-profile/:uid", getUserProfile);
router.put("/update/:id", getUserProfile);
router.post("/check-username", checkUsername);

module.exports = router;
