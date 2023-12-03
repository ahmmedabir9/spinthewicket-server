"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalTeam = void 0;
const mongoose_1 = require("mongoose");
const GlobalTeamSchema = new mongoose_1.Schema({
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
    logo: String,
    captain: {
        ref: "league_player",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
}, { timestamps: true });
const GlobalTeam = (0, mongoose_1.model)("global_team", GlobalTeamSchema);
exports.GlobalTeam = GlobalTeam;
