import { Schema, SchemaTypes, model } from "mongoose";

import { _ILeague_ } from "./_ModelTypes_";

const LeagueSchema = new Schema<_ILeague_>(
  {
    title: {
      type: String,
      required: true,
    },
    shortName: {
      type: String,
      required: true,
    },
    country: {
      type: SchemaTypes.ObjectId,
      ref: "country",
    },
    slug: {
      type: String,
      required: true,
    },
    managers: [
      {
        ref: "user",
        type: SchemaTypes.ObjectId,
      },
    ],
    logo: String,
    coverPhoto: String,
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const League = model<_ILeague_>("league", LeagueSchema);

export { League };
