"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { StatusCodes } = require("http-status-codes");
const { verify } = require("jsonwebtoken");
const { User } = require("../models/User.model");
const { Admin } = require("../models/Admin.model");
const { config } = require("./config");
const { response } = require("./response");
//verify token of user request
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        return;
    }
    try {
        const payload = yield verify(token, config.secrets.jwt);
        const user = yield User.findById(payload._id);
        if (user) {
            return user;
        }
        else {
            return;
        }
    }
    catch (error) {
        return;
    }
});
//verify token of user request
const verifyTokenAdmin = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        return;
    }
    try {
        const payload = yield verify(token, config.secrets.jwt);
        const user = yield Admin.findById(payload._id);
        if (user) {
            return user;
        }
        else {
            return;
        }
    }
    catch (error) {
        return;
    }
});
//protected route for any user
const isUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization) {
        try {
            const user = yield verifyToken(req.headers.authorization.split("Bearer ")[1]);
            if (user) {
                req.user = user;
                next();
            }
            else {
                return response(res, StatusCodes.NOT_FOUND, false, {}, "Not Authenticated");
            }
        }
        catch (error) {
            return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, error, error.message);
        }
    }
    else {
        return response(res, StatusCodes.NOT_ACCEPTABLE, false, {}, "Authentication Token not found");
    }
});
//protected route for super admin
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization) {
        try {
            const user = yield verifyTokenAdmin(req.headers.authorization.split("Bearer ")[1]);
            if (user && user.role == "admin") {
                req.user = user;
                next();
            }
            else {
                return response(res, StatusCodes.NOT_FOUND, false, {}, "Not Authenticated");
            }
        }
        catch (error) {
            return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, error, error.message);
        }
    }
    else {
        return response(res, StatusCodes.NOT_ACCEPTABLE, false, {}, "Authentication Token not found");
    }
});
module.exports = { isUser, isAdmin, verifyToken, verifyTokenAdmin };
