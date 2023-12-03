"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalLeague = void 0;
const mongoose_1 = require("mongoose");
const GlobalLeagueSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    shortName: {
        type: String,
    },
    country: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: "country",
    },
    slug: {
        type: String,
        required: true,
    },
    logo: String,
}, { timestamps: true });
const GlobalLeague = (0, mongoose_1.model)("global_league", GlobalLeagueSchema);
exports.GlobalLeague = GlobalLeague;
