import { Schema, SchemaTypes, model } from "mongoose";

import { _IPlayerInfo_ } from "./_ModelTypes_";

const PlayerInfoSchema = new Schema<_IPlayerInfo_>(
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

const PlayerInfo = model<_IPlayerInfo_>("player_info", PlayerInfoSchema);

export { PlayerInfo };
