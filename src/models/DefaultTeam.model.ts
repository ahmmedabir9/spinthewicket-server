import { Schema, model, SchemaTypes } from "mongoose";
import { _IDefaultLeague_, _IDefaultTeam_ } from "./_ModelTypes_";

const DefaultTeamSchema = new Schema<_IDefaultTeam_>(
  {
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
      type: SchemaTypes.ObjectId,
    },
  },
  { timestamps: true },
);

const DefaultLeagueSchema = new Schema<_IDefaultLeague_>(
  {
    title: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    logo: String,
  },
  { timestamps: true },
);

const DefaultLeague = model<_IDefaultLeague_>("DefaultLeague", DefaultLeagueSchema);
const DefaultTeam = model<_IDefaultTeam_>("DefaultTeam", DefaultTeamSchema);

export { DefaultTeam, DefaultLeague };
