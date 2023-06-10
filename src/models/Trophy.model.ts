import { Schema, model, SchemaTypes } from "mongoose";
import { _ITrophy_ } from "./_ModelTypes_";

const TrophySchema = new Schema<_ITrophy_>(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    trophyType: {
      type: String,
      required: true,
      enum: ["champion", "runnerup", "motm", "mots", "mostruns", "others", "mostwickets"],
    },
    tournament: {
      ref: "league_tournament",
      type: SchemaTypes.ObjectId,
    },
    match: {
      ref: "match",
      type: SchemaTypes.ObjectId,
    },
    league: {
      ref: "league",
      type: SchemaTypes.ObjectId,
    },
  },
  { timestamps: true },
);

const Trophy = model<_ITrophy_>("trophy", TrophySchema);

export { Trophy };
