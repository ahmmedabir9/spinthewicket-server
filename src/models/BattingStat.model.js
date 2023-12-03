"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BattingStatSchema = new mongoose_1.Schema({
    average: { type: Number, default: 0 },
    balls: { type: Number, default: 0 },
    best: {
        runs: { type: Number, default: 0 },
        balls: { type: Number, default: 0 },
        match: {
            ref: "Match",
            type: mongoose_1.SchemaTypes.ObjectId,
        },
    },
    centuries: { type: Number, default: 0 },
    fours: { type: Number, default: 0 },
    halfCenturies: { type: Number, default: 0 },
    innings: { type: Number, default: 0 },
    matches: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    sixes: { type: Number, default: 0 },
    strikeRate: { type: Number, default: 0 },
    dotBall: { type: Number, default: 0 },
    duck: { type: Number, default: 0 },
    notOut: { type: Number, default: 0 },
    catch: { type: Number, default: 0 },
    runOut: { type: Number, default: 0 },
}, { timestamps: true });
const BattingStat = (0, mongoose_1.model)("batting_stat", BattingStatSchema);
exports.default = BattingStat;
