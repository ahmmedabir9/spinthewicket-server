import { Schema, SchemaTypes, model } from "mongoose";

import { _ILeaguePlayer_ } from "./_ModelTypes_";

const LeaguePlayerSchema = new Schema<_ILeaguePlayer_>(
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

const LeaguePlayer = model<_ILeaguePlayer_>("league_player", LeaguePlayerSchema);

export { LeaguePlayer };
