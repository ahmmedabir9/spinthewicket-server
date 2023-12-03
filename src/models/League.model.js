"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.League = void 0;
const mongoose_1 = require("mongoose");
const LeagueSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    shortName: {
        type: String,
        required: true,
    },
    country: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: "country",
    },
    slug: {
        type: String,
        required: true,
    },
    managers: [
        {
            ref: "user",
            type: mongoose_1.SchemaTypes.ObjectId,
        },
    ],
    logo: String,
    coverPhoto: String,
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
}, { timestamps: true });
const League = (0, mongoose_1.model)("league", LeagueSchema);
exports.League = League;
