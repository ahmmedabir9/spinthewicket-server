"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DreamTeam = void 0;
const mongoose_1 = require("mongoose");
const DreamTeamSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    teamId: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    isActive: Boolean,
    theme: {
        ref: "theme",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    captain: {
        ref: "dream_player",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    manager: {
        ref: "user",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    points: { type: Number, default: 0 },
    trophies: [
        {
            trophy: {
                ref: "trophy",
                type: mongoose_1.SchemaTypes.ObjectId,
            },
            date: Date,
        },
    ],
    playingXI: [
        {
            ref: "dream_player",
            type: mongoose_1.SchemaTypes.ObjectId,
        },
    ],
    rating: { type: Number, default: 0 },
    achievements: [
        {
            achievement: {
                ref: "achievement",
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
    isBot: { type: Boolean, default: false },
}, { timestamps: true });
const DreamTeam = (0, mongoose_1.model)("dream_team", DreamTeamSchema);
exports.DreamTeam = DreamTeam;
