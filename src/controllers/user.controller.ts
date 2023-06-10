import { Request, Response } from "express";
import { _IUser_ } from "../models/_ModelTypes_";
import { StatusCodes } from "http-status-codes";
import User from "../models/User.model";
import { response } from "../utils/response";

//create user profile
const createUserProfile = async (req: Request, res: Response) => {
  const { name, email, uid, photo } = req.body;

  try {
    if (!name || !uid) {
      const msg = "Please provide all information!";
      return response(res, StatusCodes.BAD_REQUEST, false, {}, msg);
    }

    const oldUser: _IUser_ | null = await User.findOne({ uid });

    let user: _IUser_;

    if (oldUser) {
      user = oldUser;
    } else {
      let username = name.replace(/\s+/g, "").replace(/\//g, "").toLowerCase();

      const dupUsername = await User.findOne({ username }).select("_id");

      if (dupUsername) {
        const userCount = await User.countDocuments();

        username = username + userCount.toString();
      }

      const newUser: _IUser_ = new User({
        name,
        username,
        email,
        uid,
        photo,
      });

      user = await newUser.save();
    }

    if (!user) {
      const msg = "Could not create user profile!";
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    return response(res, StatusCodes.ACCEPTED, true, user, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

//get user profile
const getUserProfile = async (req: Request, res: Response) => {
  const { uid } = req.params;

  try {
    const user: _IUser_ | null = await User.findOne({ uid })
      .select("name username email nationality uid phone photo achievements xp level")
      .populate("nationality");

    if (!user) {
      const msg = "No user profile found!";
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    return response(res, StatusCodes.OK, true, { user }, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

//update user profile
const updateUserProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username } = req.body;

  try {
    let updatedFields: any = { ...req.body };

    if (username) {
      const dupUser: _IUser_ | null = await User.findOne({ username }).select("_id");

      if (dupUser) {
        const msg = "Username already taken!";
        return response(res, StatusCodes.NOT_ACCEPTABLE, false, {}, msg);
      }
    }

    const newUser: _IUser_ | null = await User.findByIdAndUpdate(id, updatedFields, { new: true })
      .select("name username email nationality uid phone photo achievements xp level")
      .populate("nationality achievements.achievement");

    if (!newUser) {
      const msg = "Could not update user!";
      return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
    }

    return response(res, StatusCodes.OK, true, { user: newUser }, null);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

//check username availability
const checkUsername = async (req: Request, res: Response) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username }).select("_id");

    if (user) {
      const msg = "Username already taken!";
      return response(res, StatusCodes.NOT_ACCEPTABLE, false, {}, msg);
    }

    const msg = "Username is available!";
    return response(res, StatusCodes.OK, true, {}, msg);
  } catch (error) {
    return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
  }
};

export { createUserProfile, getUserProfile, updateUserProfile, checkUsername };
