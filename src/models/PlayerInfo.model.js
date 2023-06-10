const { Schema, model, SchemaTypes } = require("mongoose");

const PlayerInfoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nationality: {
      ref: "country",
      type: SchemaTypes.ObjectId,
    },
    slug: {
      type: String,
      required: true,
    },
    activePlayer: { type: Boolean, default: true },
    teams: [
      {
        ref: "team",
        type: SchemaTypes.ObjectId,
      },
    ],
    role: String,
    photo: String,
    battingStyle: String,
    bowlingStyle: String,
    battingLevel: {
      type: Number,
      default: 0,
    },
    bowlingLevel: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const PlayerInfo = model("player_info", PlayerInfoSchema);

module.exports = { PlayerInfo };
