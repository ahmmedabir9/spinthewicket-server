const { Schema, model, SchemaTypes } = require("mongoose");

const BattingStatSchema = new Schema(
  {
    average: { type: Number, default: 0 },
    balls: { type: Number, default: 0 },
    best: {
      runs: { type: Number, default: 0 },
      balls: { type: Number, default: 0 },
      match: {
        ref: "match",
        type: SchemaTypes.ObjectId,
      },
    },
    centuries: { type: Number, default: 0 },
    fours: { type: Number, default: 0 },
    halfCenturies: { type: Number, default: 0 },
    innings: { type: Number, default: 0 },
    matches: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    sixes: { type: Number, default: 0 },
    strikeRate: { type: Number, default: 0 },
    dotBall: { type: Number, default: 0 },
    duck: { type: Number, default: 0 },
    notOut: { type: Number, default: 0 },
    //fielding
    catch: { type: Number, default: 0 },
    runOut: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const BattingStat = model("batting_stat", BattingStatSchema);

module.exports = { BattingStat };
