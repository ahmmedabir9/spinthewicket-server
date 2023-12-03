"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeagueTeam = void 0;
const mongoose_1 = require("mongoose");
const LeagueTeamSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    shortName: {
        type: String,
        required: true,
    },
    isActive: Boolean,
    logo: String,
    league: {
        ref: "league",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    captain: {
        ref: "league_player",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    manager: {
        ref: "user",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    points: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
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
    matches: {
        played: { type: Number, default: 0 },
        won: { type: Number, default: 0 },
        lost: { type: Number, default: 0 },
        tied: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
    },
    netRunRate: {
        against: {
            balls: { type: Number, default: 0 },
            overs: { type: Number, default: 0 },
            runs: { type: Number, default: 0 },
        },
        for: {
            balls: { type: Number, default: 0 },
            overs: { type: Number, default: 0 },
            runs: { type: Number, default: 0 },
        },
        nRR: { type: Number, default: 0 },
    },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
}, { timestamps: true });
const LeagueTeam = (0, mongoose_1.model)("league_team", LeagueTeamSchema);
exports.LeagueTeam = LeagueTeam;
