"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trophy = void 0;
const mongoose_1 = require("mongoose");
const TrophySchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    trophyType: {
        type: String,
        required: true,
        enum: ["champion", "runnerup", "motm", "mots", "mostruns", "others", "mostwickets"],
    },
    tournament: {
        ref: "league_tournament",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    match: {
        ref: "match",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    league: {
        ref: "league",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
}, { timestamps: true });
const Trophy = (0, mongoose_1.model)("trophy", TrophySchema);
exports.Trophy = Trophy;
