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
const http_status_codes_1 = require("http-status-codes");
const PlayerInfo_model_1 = require("../models/PlayerInfo.model");
const response_1 = require("../utils/response");
const getAllPlayers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, levelRange, skip, limit, sortBy, searchKey } = req.body;
    try {
        let filter = {};
        if (role) {
            filter.role = role;
        }
        const playersCount = yield PlayerInfo_model_1.PlayerInfo.countDocuments(filter)
            .where(levelRange
            ? {
                $or: [
                    {
                        bowlingLevel: { $gte: levelRange.min, $lte: levelRange.max },
                    },
                    {
                        battingLevel: { $gte: levelRange.min, $lte: levelRange.max },
                    },
                ],
            }
            : null)
            .where(searchKey
            ? {
                $or: [
                    {
                        name: { $regex: searchKey, $options: 'i' },
                    },
                    {
                        slug: { $regex: searchKey, $options: 'i' },
                    },
                ],
            }
            : null);
        const players = yield PlayerInfo_model_1.PlayerInfo.find(filter)
            .where(levelRange
            ? {
                $or: [
                    {
                        bowlingLevel: { $gte: levelRange.min, $lte: levelRange.max },
                    },
                    {
                        battingLevel: { $gte: levelRange.min, $lte: levelRange.max },
                    },
                ],
            }
            : null)
            .where(searchKey
            ? {
                $or: [
                    {
                        name: { $regex: searchKey, $options: 'i' },
                    },
                    {
                        slug: { $regex: searchKey, $options: 'i' },
                    },
                ],
            }
            : null)
            .skip(skip)
            .limit(limit)
            .sort(sortBy ? { [sortBy.field]: [sortBy.order] } : { name: 1 });
        if (!players || players.length === 0) {
            let msg = 'no players found!';
            return (0, response_1.response)(res, http_status_codes_1.StatusCodes.NOT_FOUND, false, null, msg);
        }
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.OK, true, { players, playersCount }, null);
    }
    catch (error) {
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
    }
});
const getRandomCaptains = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const populateFields = [
            {
                path: 'teams',
            },
        ];
        let allrounders = yield PlayerInfo_model_1.PlayerInfo.find({ role: 'All-Rounder' })
            .where({
            bowlingLevel: { $gte: 65 },
        })
            .where({
            bowlingLevel: { $lte: 75 },
        })
            .where({
            battingLevel: { $gte: 65 },
        })
            .where({
            battingLevel: { $lte: 75 },
        })
            .populate(populateFields);
        let batsmen = yield PlayerInfo_model_1.PlayerInfo.find({ role: 'Batsman' })
            .where({
            battingLevel: { $gte: 75 },
        })
            .where({
            battingLevel: { $lte: 80 },
        })
            .populate(populateFields);
        let keepers = yield PlayerInfo_model_1.PlayerInfo.find({ role: 'Wicket-Keeper' })
            .where({
            battingLevel: { $gte: 75 },
        })
            .where({
            battingLevel: { $lte: 80 },
        })
            .populate(populateFields);
        let bowlers = yield PlayerInfo_model_1.PlayerInfo.find({ role: 'Bowler' })
            .where({
            bowlingLevel: { $gte: 75 },
        })
            .where({
            bowlingLevel: { $lte: 80 },
        })
            .populate(populateFields);
        shufflePlayers(allrounders);
        shufflePlayers(batsmen);
        shufflePlayers(bowlers);
        shufflePlayers(keepers);
        const captains = [
            ...batsmen.slice(0, 2),
            ...allrounders.slice(0, 2),
            ...bowlers.slice(0, 1),
            ...keepers.slice(0, 1),
        ];
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.OK, true, captains, null);
    }
    catch (error) {
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
    }
});
const shufflePlayers = (players) => {
    let currentIndex = players.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [players[currentIndex], players[randomIndex]] = [players[randomIndex], players[currentIndex]];
    }
    return players;
};
module.exports = { getRandomCaptains, shufflePlayers, getAllPlayers };
