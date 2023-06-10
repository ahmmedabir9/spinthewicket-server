import { Schema, model, SchemaTypes } from "mongoose";
import { _IBowlingStat_ } from "./_ModelTypes_";

const BowlingStatSchema = new Schema<_IBowlingStat_>(
  {
    average: { type: Number, default: 0 },
    balls: { type: Number, default: 0 },
    best: {
      runs: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
      match: {
        ref: "Match",
        type: SchemaTypes.ObjectId,
      },
    },
    economy: { type: Number, default: 0 },
    fiveWickets: { type: Number, default: 0 },
    innings: { type: Number, default: 0 },
    matches: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    threeWickets: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    dotBalls: { type: Number, default: 0 },
    maidens: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const BowlingStat = model<_IBowlingStat_>("bowling_stat", BowlingStatSchema);

export default BowlingStat;
