"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DreamPlayer = void 0;
const mongoose_1 = require("mongoose");
const DreamPlayerSchema = new mongoose_1.Schema({
    playerInfo: {
        ref: "player_info",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    activePlayer: { type: Boolean, default: true },
    battingStat: {
        ref: "batting_stat",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    bowlingStat: {
        ref: "bowling_stat",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    team: {
        ref: "dream_team",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    trophies: [
        {
            trophy: {
                ref: "trophy",
                type: mongoose_1.SchemaTypes.ObjectId,
            },
            date: { type: Date, default: Date.now },
        },
    ],
    achievements: [
        {
            achievement: {
                ref: "achievement",
                type: mongoose_1.SchemaTypes.ObjectId,
            },
            date: { type: Date, default: Date.now },
        },
    ],
    isBot: { type: Boolean, default: false },
}, { timestamps: true });
const DreamPlayer = (0, mongoose_1.model)("dream_player", DreamPlayerSchema);
exports.DreamPlayer = DreamPlayer;
