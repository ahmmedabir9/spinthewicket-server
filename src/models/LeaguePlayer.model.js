"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaguePlayer = void 0;
const mongoose_1 = require("mongoose");
const LeaguePlayerSchema = new mongoose_1.Schema({
    playerID: {
        type: Number,
        required: true,
    },
    playerInfo: {
        ref: "player_info",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    league: {
        ref: "league",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    activePlayer: { type: Boolean, default: true },
    battingStat: {
        ref: "batting_stat",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    bwlingStat: {
        ref: "bowling_stat",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    team: {
        ref: "league_team",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    trophies: [
        {
            trophy: {
                ref: "trophy",
                type: mongoose_1.SchemaTypes.ObjectId,
            },
            date: Date,
        },
    ],
    achivements: [
        {
            achivement: {
                ref: "achivement",
                type: mongoose_1.SchemaTypes.ObjectId,
            },
            date: Date,
        },
    ],
}, { timestamps: true });
const LeaguePlayer = (0, mongoose_1.model)("league_player", LeaguePlayerSchema);
exports.LeaguePlayer = LeaguePlayer;
