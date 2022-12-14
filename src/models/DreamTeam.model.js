const { Schema, model, SchemaTypes } = require("mongoose");

const DreamTeamSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    teamId: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    isActive: Boolean,
    theme: {
      ref: "theme",
      type: SchemaTypes.ObjectId,
    },
    captain: {
      ref: "dream_player",
      type: SchemaTypes.ObjectId,
    },
    manager: {
      ref: "user",
      type: SchemaTypes.ObjectId,
    },
    points: { type: Number, default: 0 },
    trophies: [
      {
        trophy: {
          ref: "trophy",
          type: SchemaTypes.ObjectId,
        },
        date: Date,
      },
    ],
    playingXI: [
      {
        ref: "dream_player",
        type: SchemaTypes.ObjectId,
      },
    ],
    rating: { type: Number, default: 0 },
    achivements: [
      {
        achivement: {
          ref: "achivement",
          type: SchemaTypes.ObjectId,
        },
        date: Date,
      },
    ],
    matches: {
      played: { type: Number, default: 0 },
      won: { type: Number, default: 0 },
      lost: { type: Number, default: 0 },
      tied: { type: Number, default: 0 },
      points: { type: Number, default: 0 },
    },
    netRunRate: {
      against: {
        balls: { type: Number, default: 0 },
        overs: { type: Number, default: 0 },
        runs: { type: Number, default: 0 },
      },
      for: {
        balls: { type: Number, default: 0 },
        overs: { type: Number, default: 0 },
        runs: { type: Number, default: 0 },
      },
      nRR: { type: Number, default: 0 },
    },
    isBot: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const DreamTeam = model("dream_team", DreamTeamSchema);

module.exports = { DreamTeam };
