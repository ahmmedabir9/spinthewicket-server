import { Schema, model, SchemaTypes } from "mongoose";
import { _IGlobalTeam_ } from "./_ModelTypes_";

const GlobalTeamSchema = new Schema<_IGlobalTeam_>(
  {
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
      type: SchemaTypes.ObjectId,
    },
  },
  { timestamps: true },
);

const GlobalTeam = model<_IGlobalTeam_>("global_team", GlobalTeamSchema);

export { GlobalTeam };
