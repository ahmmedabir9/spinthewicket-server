import { Schema, SchemaTypes, model } from "mongoose";

import { _IDreamPlayer_ } from "./_ModelTypes_";

const DreamPlayerSchema = new Schema<_IDreamPlayer_>(
  {
    playerInfo: {
      ref: "player_info",
      type: SchemaTypes.ObjectId,
    },
    activePlayer: { type: Boolean, default: true },
    battingStat: {
      ref: "batting_stat",
      type: SchemaTypes.ObjectId,
    },
    bowlingStat: {
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
        date: { type: Date, default: Date.now },
      },
    ],
    achievements: [
      {
        achievement: {
          ref: "achievement",
          type: SchemaTypes.ObjectId,
        },
        date: { type: Date, default: Date.now },
      },
    ],
    isBot: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const DreamPlayer = model<_IDreamPlayer_>("dream_player", DreamPlayerSchema);

export { DreamPlayer };
