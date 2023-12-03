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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUsername = exports.updateUserProfile = exports.getUserProfile = exports.createUserProfile = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_model_1 = __importDefault(require("../models/User.model"));
const response_1 = require("../utils/response");
//create user profile
const createUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, uid, photo } = req.body;
    try {
        if (!name || !uid) {
            const msg = "Please provide all information!";
            return (0, response_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, {}, msg);
        }
        const oldUser = yield User_model_1.default.findOne({ uid });
        let user;
        if (oldUser) {
            user = oldUser;
        }
        else {
            let username = name.replace(/\s+/g, "").replace(/\//g, "").toLowerCase();
            const dupUsername = yield User_model_1.default.findOne({ username }).select("_id");
            if (dupUsername) {
                const userCount = yield User_model_1.default.countDocuments();
                username = username + userCount.toString();
            }
            const newUser = new User_model_1.default({
                name,
                username,
                email,
                uid,
                photo,
            });
            user = yield newUser.save();
        }
        if (!user) {
            const msg = "Could not create user profile!";
            return (0, response_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, null, msg);
        }
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.ACCEPTED, true, user, null);
    }
    catch (error) {
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
    }
});
exports.createUserProfile = createUserProfile;
//get user profile
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params;
    try {
        const user = yield User_model_1.default.findOne({ uid })
            .select("name username email nationality uid phone photo achievements xp level")
            .populate("nationality");
        if (!user) {
            const msg = "No user profile found!";
            return (0, response_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, null, msg);
        }
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.OK, true, { user }, null);
    }
    catch (error) {
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
    }
});
exports.getUserProfile = getUserProfile;
//update user profile
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { username } = req.body;
    try {
        let updatedFields = Object.assign({}, req.body);
        if (username) {
            const dupUser = yield User_model_1.default.findOne({ username }).select("_id");
            if (dupUser) {
                const msg = "Username already taken!";
                return (0, response_1.response)(res, http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, false, {}, msg);
            }
        }
        const newUser = yield User_model_1.default.findByIdAndUpdate(id, updatedFields, { new: true })
            .select("name username email nationality uid phone photo achievements xp level")
            .populate("nationality achievements.achievement");
        if (!newUser) {
            const msg = "Could not update user!";
            return (0, response_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, null, msg);
        }
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.OK, true, { user: newUser }, null);
    }
    catch (error) {
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
    }
});
exports.updateUserProfile = updateUserProfile;
//check username availability
const checkUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    try {
        const user = yield User_model_1.default.findOne({ username }).select("_id");
        if (user) {
            const msg = "Username already taken!";
            return (0, response_1.response)(res, http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, false, {}, msg);
        }
        const msg = "Username is available!";
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.OK, true, {}, msg);
    }
    catch (error) {
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
    }
});
exports.checkUsername = checkUsername;
