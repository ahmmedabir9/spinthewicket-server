"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BowlingStatSchema = new mongoose_1.Schema({
    average: { type: Number, default: 0 },
    balls: { type: Number, default: 0 },
    best: {
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        match: {
            ref: "Match",
            type: mongoose_1.SchemaTypes.ObjectId,
        },
    },
    economy: { type: Number, default: 0 },
    fiveWickets: { type: Number, default: 0 },
    innings: { type: Number, default: 0 },
    matches: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    threeWickets: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    dotBalls: { type: Number, default: 0 },
    maidens: { type: Number, default: 0 },
}, { timestamps: true });
const BowlingStat = (0, mongoose_1.model)("bowling_stat", BowlingStatSchema);
exports.default = BowlingStat;
