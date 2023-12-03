"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerInfo = void 0;
const mongoose_1 = require("mongoose");
const PlayerInfoSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    nationality: {
        ref: "country",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    slug: {
        type: String,
        required: true,
    },
    activePlayer: { type: Boolean, default: true },
    teams: [
        {
            ref: "team",
            type: mongoose_1.SchemaTypes.ObjectId,
        },
    ],
    role: String,
    photo: String,
    battingStyle: String,
    bowlingStyle: String,
    battingLevel: {
        type: Number,
        default: 0,
    },
    bowlingLevel: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
const PlayerInfo = (0, mongoose_1.model)("player_info", PlayerInfoSchema);
exports.PlayerInfo = PlayerInfo;
