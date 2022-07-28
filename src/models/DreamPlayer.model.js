const { Schema, model, SchemaTypes } = require("mongoose");

const DreamPlayerSchema = new Schema(
  {
    playerInfo: {
      ref: "player_info",
      type: SchemaTypes.ObjectId,
    },
    activePlayer: { type: Boolean, default: true },
    battingStats: {
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
    bwlingStats: {
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
    team: {
      ref: "dream_team",
      type: SchemaTypes.ObjectId,
    },
    trophies: [
      {
        trophy: {
          ref: "trophy",
          type: SchemaTypes.ObjectId,
        },
        date: Date,
      },
    ],
    achivements: [
      {
        achivement: {
          ref: "achivement",
          type: SchemaTypes.ObjectId,
        },
        date: Date,
      },
    ],
  },
  { timestamps: true }
);

const DreamPlayer = model("dream_player", DreamPlayerSchema);

module.exports = { DreamPlayer };
