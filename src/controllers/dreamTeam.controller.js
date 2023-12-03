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
const http_status_codes_1 = require("http-status-codes");
const BattingStat_model_1 = __importDefault(require("../models/BattingStat.model"));
const BowlingStat_model_1 = __importDefault(require("../models/BowlingStat.model"));
const DreamPlayer_model_1 = require("../models/DreamPlayer.model");
const DreamTeam_model_1 = require("../models/DreamTeam.model");
const PlayerInfo_model_1 = require("../models/PlayerInfo.model");
const constants_1 = require("../utils/constants");
const response_1 = require("../utils/response");
const utilities_1 = require("../utils/utilities");
const teamPopulate = [
    { path: 'theme' },
    { path: 'manager' },
    {
        path: 'captain',
        populate: {
            path: 'playerInfo',
        },
    },
    {
        path: 'playingXI',
        populate: {
            path: 'playerInfo',
        },
    },
];
const createDreamTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, code, theme, manager, captain } = req.body;
    if (!title || !code || !manager || !theme || !captain) {
        const msg = 'Provide all information!';
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, {}, msg);
    }
    try {
        let teamId = title.replace(/\s+/g, '').replace(/\//g, '').toLowerCase();
        const oldTeam = yield DreamTeam_model_1.DreamTeam.findOne({ teamId }).select('_id');
        if (oldTeam) {
            const teamCount = yield DreamTeam_model_1.DreamTeam.countDocuments();
            teamId = teamId + teamCount.toString();
        }
        const team = yield DreamTeam_model_1.DreamTeam.create(Object.assign({ title,
            code,
            teamId,
            theme,
            manager }, constants_1.initialTeamData));
        if (!team) {
            const msg = 'Could not create team!';
            return (0, response_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, null, msg);
        }
        const captainPlayer = yield createDreamSquad(captain, team === null || team === void 0 ? void 0 : team._id);
        const squad = yield DreamPlayer_model_1.DreamPlayer.find({ team: team === null || team === void 0 ? void 0 : team._id }).populate('playerInfo');
        const playingXI = yield createPlayingXI(squad);
        const teamRating = yield calculateTeamRating(playingXI);
        const newTeam = yield DreamTeam_model_1.DreamTeam.findByIdAndUpdate(team === null || team === void 0 ? void 0 : team._id, {
            rating: teamRating,
            captain: captainPlayer === null || captainPlayer === void 0 ? void 0 : captainPlayer._id,
            playingXI: playingXI.map((item) => item._id),
        }, { new: true })
            .populate('captain')
            .populate('playingXI');
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.ACCEPTED, true, { team: newTeam, squad }, null);
    }
    catch (error) {
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
    }
});
const getUserDreamTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const dreamTeam = yield DreamTeam_model_1.DreamTeam.findOne({ manager: id }).populate([
            { path: 'manager theme captain' },
            {
                path: 'playingXI',
                populate: 'playerInfo',
            },
        ]);
        if (!dreamTeam) {
            return (0, response_1.response)(res, http_status_codes_1.StatusCodes.NOT_FOUND, false, null, 'You Do not Have Dream Team!');
        }
        const dreamPlayers = yield DreamPlayer_model_1.DreamPlayer.find({
            team: dreamTeam === null || dreamTeam === void 0 ? void 0 : dreamTeam._id,
        }).populate('playerInfo');
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.OK, true, { dreamTeam, dreamPlayers }, null);
    }
    catch (error) {
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
    }
});
const getDreamTeamById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const dreamTeam = yield DreamTeam_model_1.DreamTeam.findById(id).populate('manager theme captain playingXI');
        if (!dreamTeam) {
            return (0, response_1.response)(res, http_status_codes_1.StatusCodes.NOT_FOUND, false, null, 'No Team Found!');
        }
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.OK, true, dreamTeam, null);
    }
    catch (error) {
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
    }
});
const getDreamTeamSquad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const dreamPlayers = yield DreamPlayer_model_1.DreamPlayer.find({ team: id }).populate('player');
        if (!dreamPlayers || dreamPlayers.length === 0) {
            return (0, response_1.response)(res, http_status_codes_1.StatusCodes.NOT_FOUND, false, null, 'No Players Found!');
        }
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.OK, true, dreamPlayers, null);
    }
    catch (error) {
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
    }
});
const updateTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const dataToUpdate = {};
        if (title) {
            let teamId = title.replace(/\s+/g, '').replace(/\//g, '').toLowerCase();
            const oldTeam = yield DreamTeam_model_1.DreamTeam.findOne({ teamId }).select('_id');
            if (oldTeam) {
                const teamCount = yield DreamTeam_model_1.DreamTeam.countDocuments();
                teamId = teamId + '-' + teamCount.toString();
            }
            dataToUpdate.title = title;
            dataToUpdate.teamId = teamId;
        }
        const dreamTeam = yield DreamTeam_model_1.DreamTeam.findByIdAndUpdate(id, dataToUpdate, {
            new: true,
        }).populate(teamPopulate);
        if (!dreamTeam) {
            return (0, response_1.response)(res, http_status_codes_1.StatusCodes.NOT_FOUND, false, null, 'Could Not Update Squad!');
        }
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.OK, true, dreamTeam, null);
    }
    catch (error) {
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
    }
});
const createBotTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, code, theme, captain, rating } = req.body;
    if (!title || !code || !theme || !captain || !rating) {
        const msg = 'Provide all information!';
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, {}, msg);
    }
    try {
        let teamId = title.replace(/\s+/g, '').replace(/\//g, '').toLowerCase();
        const oldTeam = yield DreamTeam_model_1.DreamTeam.findOne({ teamId }).select('_id');
        if (oldTeam) {
            const teamCount = yield DreamTeam_model_1.DreamTeam.countDocuments();
            teamId = teamId + teamCount.toString();
        }
        const team = yield DreamTeam_model_1.DreamTeam.create(Object.assign({ title,
            code,
            teamId,
            theme, isBot: true }, constants_1.initialTeamData));
        if (!team) {
            const msg = 'Could not create team!';
            return (0, response_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, null, msg);
        }
        const captainPlayer = yield createDreamSquad(captain, team === null || team === void 0 ? void 0 : team._id, true, rating);
        const squad = yield DreamPlayer_model_1.DreamPlayer.find({ team: team === null || team === void 0 ? void 0 : team._id }).populate('player');
        const playingXI = yield createPlayingXI(squad);
        const teamRating = yield calculateTeamRating(playingXI);
        const newTeam = yield DreamTeam_model_1.DreamTeam.findByIdAndUpdate(team === null || team === void 0 ? void 0 : team._id, {
            rating: teamRating,
            captain: captainPlayer === null || captainPlayer === void 0 ? void 0 : captainPlayer._id,
            playingXI: playingXI.map((item) => item._id),
        }, { new: true })
            .populate('captain')
            .populate('playingXI');
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.ACCEPTED, true, { team: newTeam, squad }, null);
    }
    catch (error) {
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
    }
});
const createDreamSquad = (captain, team, isBot = false, rating) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allrounders, batsmen, keepers, bowlers;
        if (isBot) {
            allrounders = yield PlayerInfo_model_1.PlayerInfo.find({
                _id: { $ne: captain },
                role: 'All-Rounder',
                bowlingLevel: { $gte: rating - 20, $lte: rating + 5 },
                battingLevel: { $gte: rating - 20, $lte: rating + 5 },
            }).select('_id');
            batsmen = yield PlayerInfo_model_1.PlayerInfo.find({
                _id: { $ne: captain },
                role: 'Batsman',
                battingLevel: { $gte: rating - 10, $lte: rating + 10 },
            }).select('_id');
            keepers = yield PlayerInfo_model_1.PlayerInfo.find({
                _id: { $ne: captain },
                role: 'Wicket-Keeper',
                battingLevel: { $gte: rating - 10, $lte: rating + 10 },
            }).select('_id');
            bowlers = yield PlayerInfo_model_1.PlayerInfo.find({
                _id: { $ne: captain },
                role: 'Bowler',
                bowlingLevel: { $gte: rating - 10, $lte: rating + 10 },
            }).select('_id');
        }
        else {
            allrounders = yield PlayerInfo_model_1.PlayerInfo.find({
                _id: { $ne: captain },
                role: 'All-Rounder',
                bowlingLevel: { $gte: 50, $lte: 75 },
                battingLevel: { $gte: 50, $lte: 75 },
            }).select('_id');
            batsmen = yield PlayerInfo_model_1.PlayerInfo.find({
                _id: { $ne: captain },
                role: 'Batsman',
                battingLevel: { $gte: 60, $lte: 80 },
            }).select('_id');
            keepers = yield PlayerInfo_model_1.PlayerInfo.find({
                _id: { $ne: captain },
                role: 'Wicket-Keeper',
                battingLevel: { $gte: 60, $lte: 80 },
            }).select('_id');
            bowlers = yield PlayerInfo_model_1.PlayerInfo.find({
                _id: { $ne: captain },
                role: 'Bowler',
                bowlingLevel: { $gte: 60, $lte: 80 },
            }).select('_id');
        }
        (0, utilities_1.shufflePlayers)(allrounders);
        (0, utilities_1.shufflePlayers)(batsmen);
        (0, utilities_1.shufflePlayers)(bowlers);
        (0, utilities_1.shufflePlayers)(keepers);
        const players = [
            ...batsmen.slice(0, 5),
            ...allrounders.slice(0, 4),
            ...bowlers.slice(0, 4),
            ...keepers.slice(0, 1),
        ].map((item) => item._id);
        const captainBattingStat = yield BattingStat_model_1.default.create(Object.assign({}, constants_1.initialBattingStat));
        const captainBowlingStat = yield BowlingStat_model_1.default.create(Object.assign({}, constants_1.initialBowlingStat));
        const captainPlayer = yield DreamPlayer_model_1.DreamPlayer.create(Object.assign({ playerInfo: captain, team: team, isBot: isBot, battingStat: captainBattingStat === null || captainBattingStat === void 0 ? void 0 : captainBattingStat._id, bowlingStat: captainBowlingStat === null || captainBowlingStat === void 0 ? void 0 : captainBowlingStat._id }, constants_1.initialPlayerData));
        for (let index = 0; index < players.length; index++) {
            const playerBattingStat = yield BattingStat_model_1.default.create(Object.assign({}, constants_1.initialBattingStat));
            const playerBowlingStat = yield BowlingStat_model_1.default.create(Object.assign({}, constants_1.initialBowlingStat));
            yield DreamPlayer_model_1.DreamPlayer.create(Object.assign({ playerInfo: players[index], team: team, isBot: isBot, battingStat: playerBattingStat === null || playerBattingStat === void 0 ? void 0 : playerBattingStat._id, bowlingStat: playerBowlingStat === null || playerBowlingStat === void 0 ? void 0 : playerBowlingStat._id }, constants_1.initialPlayerData));
        }
        return captainPlayer._id;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
const createPlayingXI = (squad) => __awaiter(void 0, void 0, void 0, function* () {
    const bowlers = squad
        .sort((a, b) => (a.playerInfo.bowlingLevel < b.playerInfo.bowlingLevel ? 1 : -1))
        .slice(0, 5);
    const batsmen = squad
        .sort((a, b) => (a.playerInfo.battingLevel < b.playerInfo.battingLevel ? 1 : -1))
        .filter((batsman) => !bowlers.find((bowler) => (bowler === null || bowler === void 0 ? void 0 : bowler._id) === (batsman === null || batsman === void 0 ? void 0 : batsman._id)))
        .slice(0, 6);
    const playingXI = [...batsmen, ...bowlers].sort((a, b) => a.playerInfo.battingLevel < b.playerInfo.battingLevel ? 1 : -1);
    return playingXI;
});
const calculateTeamRating = (playingXI) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    let totalRating = 0;
    for (let index = 0; index < playingXI.length; index++) {
        const player = playingXI[index];
        totalRating +=
            ((_a = player.playerInfo) === null || _a === void 0 ? void 0 : _a.battingLevel) > ((_b = player.playerInfo) === null || _b === void 0 ? void 0 : _b.bowlingLevel)
                ? (_c = player.playerInfo) === null || _c === void 0 ? void 0 : _c.battingLevel
                : (_d = player.playerInfo) === null || _d === void 0 ? void 0 : _d.bowlingLevel;
    }
    return totalRating / 11;
});
module.exports = {
    createDreamTeam,
    getUserDreamTeam,
    getDreamTeamById,
    updateTeam,
    getDreamTeamSquad,
    createBotTeam,
};
