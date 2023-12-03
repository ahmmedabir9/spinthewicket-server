"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultLeague = exports.DefaultTeam = void 0;
const mongoose_1 = require("mongoose");
const DefaultTeamSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    isActive: Boolean,
    logo: String,
    league: {
        ref: "DefaultLeague",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
}, { timestamps: true });
const DefaultLeagueSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    logo: String,
}, { timestamps: true });
const DefaultLeague = (0, mongoose_1.model)("DefaultLeague", DefaultLeagueSchema);
exports.DefaultLeague = DefaultLeague;
const DefaultTeam = (0, mongoose_1.model)("DefaultTeam", DefaultTeamSchema);
exports.DefaultTeam = DefaultTeam;
