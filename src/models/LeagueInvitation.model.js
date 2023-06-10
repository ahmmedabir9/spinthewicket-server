const { Schema, model, SchemaTypes } = require("mongoose");

const LeagueInvitationSchema = new Schema(
  {
    invitedBy: {
      ref: "league",
      type: SchemaTypes.ObjectId,
    },
    invitedTo: {
      ref: "user",
      type: SchemaTypes.ObjectId,
    },
  },
  { timestamps: true },
);

const LeagueInvitation = model("league_invitation", LeagueInvitationSchema);

module.exports = { LeagueInvitation };
