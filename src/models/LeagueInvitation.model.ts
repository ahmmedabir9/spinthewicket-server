import { Schema, SchemaTypes, model } from "mongoose";

import { _ILeagueInvitation_ } from "./_ModelTypes_";

const LeagueInvitationSchema = new Schema<_ILeagueInvitation_>(
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

const LeagueInvitation = model<_ILeagueInvitation_>("league_invitation", LeagueInvitationSchema);

export { LeagueInvitation };
