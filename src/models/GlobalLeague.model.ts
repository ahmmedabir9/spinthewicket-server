import { Schema, model, SchemaTypes } from "mongoose";
import { _IGlobalLeague_ } from "./_ModelTypes_";

const GlobalLeagueSchema = new Schema<_IGlobalLeague_>(
  {
    title: {
      type: String,
      required: true,
    },
    shortName: {
      type: String,
    },
    country: {
      type: SchemaTypes.ObjectId,
      ref: "country",
    },
    slug: {
      type: String,
      required: true,
    },
    logo: String,
  },
  { timestamps: true },
);

const GlobalLeague = model<_IGlobalLeague_>("global_league", GlobalLeagueSchema);

export { GlobalLeague };
