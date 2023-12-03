"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeagueInvitation = void 0;
const mongoose_1 = require("mongoose");
const LeagueInvitationSchema = new mongoose_1.Schema({
    invitedBy: {
        ref: "league",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    invitedTo: {
        ref: "user",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
}, { timestamps: true });
const LeagueInvitation = (0, mongoose_1.model)("league_invitation", LeagueInvitationSchema);
exports.LeagueInvitation = LeagueInvitation;
