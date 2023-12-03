import { Response } from "express";


import  { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import User from "../models/User.model";
import { response } from "../utils/response";
import { sign } from "jsonwebtoken";

const config = {
  secrets: {
    jwt: "PJaHvt8ASQvFgSgYI2gyc8a9TdHzLh5Rx98s7aB4nhUz4rvW92zsKvN6zbPIub",
    jwtExp: "30d",
  },
};

const createToken = (user) => {
  console.log("💡 | file: protected.ts:18 | user:", user)
  return sign(
   {
     _id: user._id,
     name: user.name,
     email: user.email,
     username: user.username,
     photo: user.photo,
     level: user.level,
     xp: user.xp,
   },
    config.secrets.jwt,
    {
      expiresIn: config.secrets.jwtExp,
    }
  );
};


//verify token of user request
const verifyToken = async (token: string) => {
  if (!token) {
    return;
  }
  try {
    const payload: any = await verify(token, config.secrets.jwt);
    const user = await User.findById(payload._id);

    if (user) {
      return user;
    } else {
      return;
    }
  } catch (error) {
    return;
  }
};

//verify token of user request

//protected route for any user
const isUser = async (req: any, res: Response, next: any) => {
  if (req.headers.authorization) {
    try {
      const user = await verifyToken(req.headers.authorization.split("Bearer ")[1]);

      if (user) {
        req.user = user;
        next();
      } else {
        return response(res, StatusCodes.NOT_FOUND, false, {}, "Not Authenticated");
      }
    } catch (error: any) {
      return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, error, error.message);
    }
  } else {
    return response(res, StatusCodes.NOT_ACCEPTABLE, false, {}, "Authentication Token not found");
  }
};

//protected route for super admin


export { isUser,  verifyToken , createToken};
