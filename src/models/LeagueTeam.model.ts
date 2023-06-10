import { _ILeagueTeam_ } from "./_ModelTypes_";
import { Schema, model, SchemaTypes } from "mongoose";

const LeagueTeamSchema = new Schema<_ILeagueTeam_>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    shortName: {
      type: String,
      required: true,
    },
    isActive: Boolean,
    logo: String,
    league: {
      ref: "league",
      type: SchemaTypes.ObjectId,
    },
    captain: {
      ref: "league_player",
      type: SchemaTypes.ObjectId,
    },
    manager: {
      ref: "user",
      type: SchemaTypes.ObjectId,
    },
    points: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
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
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const LeagueTeam = model<_ILeagueTeam_>("league_team", LeagueTeamSchema);

export { LeagueTeam };
