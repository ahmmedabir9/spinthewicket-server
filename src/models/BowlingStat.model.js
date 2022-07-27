const { Schema, model, SchemaTypes } = require("mongoose");

const BowlingStatSchema = new Schema(
  {
    average: { type: Number, default: 0 },
    balls: { type: Number, default: 0 },
    best: {
      runs: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
      match: {
        ref: "match",
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
  { timestamps: true }
);

const BowlingStat = model("bowling_stat", BowlingStatSchema);

module.exports = { BowlingStat };
