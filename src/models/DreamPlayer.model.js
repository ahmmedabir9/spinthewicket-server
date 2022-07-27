const { Schema, model, SchemaTypes } = require("mongoose");

const DreamPlayerSchema = new Schema(
  {
    playerID: {
      type: String,
    },
    playerInfo: {
      ref: "player_info",
      type: SchemaTypes.ObjectId,
    },
    activePlayer: { type: Boolean, default: true },
    battingStat: {
      ref: "batting_stat",
      type: SchemaTypes.ObjectId,
    },
    bwlingStat: {
      ref: "bowling_stat",
      type: SchemaTypes.ObjectId,
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
