const { StatusCodes } = require("http-status-codes");
const { User } = require("../models/User.model");
const { response } = require("../utils/response");

//create user profile
const createUserProfile = async (req, res) => {
  const { name, email, uid, photo } = req.body;

  try {
    if (!name || !uid) {
      let msg = "provide all informations!";
      return response(res, StatusCodes.BAD_REQUEST, false, {}, msg);
    }

    const oldUser = await User.findOne({ uid: uid });

    let user;

    if (oldUser) {
      user = oldUser;
    } else {
      var username = name.replace(/\s+/g, "").replace(/\//g, "").toLowerCase();

      const dupUsername = await User.findOne({
        username: username,
      }).select("_id");

      if (dupUsername) {
        const userCount = await User.countDocuments();

        username = username + userCount.toString();
      }

      user = await User.create({
        name,
        username,
        email,
        uid,
        photo,
      });
    }

    if (!user) {
      let msg = "could not create user profile!";
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    return response(res, StatusCodes.ACCEPTED, true, user, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

//get user profile
const getUserProfile = async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await User.findOne({ uid: uid })
      .select("name username email nationality uid phone photo achivements xp level")
      .populate("nationality");

    if (!user) {
      let msg = "no user profile found!";
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    return response(res, StatusCodes.OK, true, { user: user }, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

//update user profile
const updateUserProfile = async (req, res) => {
  const { id } = req.params;

  const { name, photo, nationality, username } = req.body;

  try {
    var user = {};

    if (username) {
      const dupUser = await User.findOne({ username: username }).select("_id");

      if (dupUser) {
        let msg = "username already taken!";
        return response(res, StatusCodes.NOT_ACCEPTABLE, false, {}, msg);
      }

      user.username = username;
    }
    if (name) {
      user.name = name;
    }
    if (photo) {
      user.photo = photo;
    }
    if (nationality) {
      user.nationality = nationality;
    }

    const newUser = await User.findByIdAndUpdate(id, user, { new: true })
      .select("name username email nationality uid phone photo achivements xp level")
      .populate("nationality achivements.achivement");

    if (!newUser) {
      let msg = "could not update user!";
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    return response(res, StatusCodes.OK, true, { user: newUser }, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

//check username availability
const checkUsername = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username: username }).select("_id");

    if (user) {
      let msg = "username already taken!";
      return response(res, StatusCodes.NOT_ACCEPTABLE, false, {}, msg);
    }

    let msg = "username is available!";
    return response(res, StatusCodes.OK, true, {}, msg);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

module.exports = {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  checkUsername,
};
