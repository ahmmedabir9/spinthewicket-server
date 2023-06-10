const { Schema, model, SchemaTypes } = require("mongoose");

const LeaguePlayerSchema = new Schema(
  {
    playerID: {
      type: Number,
      required: true,
    },
    playerInfo: {
      ref: "player_info",
      type: SchemaTypes.ObjectId,
    },
    league: {
      ref: "league",
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
      ref: "league_team",
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
  { timestamps: true },
);

const LeaguePlayer = model("league_player", LeaguePlayerSchema);

module.exports = { LeaguePlayer };
