import { Schema, model, SchemaTypes } from "mongoose";
import {
  _ILeagueTournamentPlayerStat_,
  _ILeagueTournamentPointTable_,
  _ILeagueTournamentResult_,
  _ILeagueTournament_,
} from "./_ModelTypes_";

const AgainstStatsSchema = new Schema(
  {
    balls: {
      type: Number,
      default: 0,
    },
    overs: {
      type: Number,
      default: 0,
    },
    runs: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const ForStatsSchema = new Schema(
  {
    balls: {
      type: Number,
      default: 0,
    },
    overs: {
      type: Number,
      default: 0,
    },
    runs: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const NetRunRateSchema = new Schema(
  {
    against: AgainstStatsSchema,
    for: ForStatsSchema,
    nRR: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const PlayerStatSchema = new Schema<_ILeagueTournamentPlayerStat_>(
  {
    player: {
      ref: "league_player",
      type: SchemaTypes.ObjectId,
    },
    team: {
      ref: "league_team",
      type: SchemaTypes.ObjectId,
    },
    sixes: {
      type: Number,
      default: 0,
    },
    fours: {
      type: Number,
      default: 0,
    },
    runs: {
      type: Number,
      default: 0,
    },
    wickets: {
      type: Number,
      default: 0,
    },
    performance: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const PointTableSchema = new Schema<_ILeagueTournamentPointTable_>(
  {
    team: {
      ref: "league_team",
      type: SchemaTypes.ObjectId,
    },
    played: {
      type: Number,
      default: 0,
    },
    won: {
      type: Number,
      default: 0,
    },
    lost: {
      type: Number,
      default: 0,
    },
    tied: {
      type: Number,
      default: 0,
    },
    wickets: {
      type: Number,
      default: 0,
    },
    points: {
      type: Number,
      default: 0,
    },
    netRunRate: NetRunRateSchema,
  },
  { _id: false },
);

const ResultSchema = new Schema<_ILeagueTournamentResult_>(
  {
    champion: {
      ref: "league_team",
      type: SchemaTypes.ObjectId,
    },
    runnerUp: {
      ref: "league_team",
      type: SchemaTypes.ObjectId,
    },
    manOfTheSeries: {
      ref: "league_player",
      type: SchemaTypes.ObjectId,
    },
    mostRuns: {
      ref: "league_player",
      type: SchemaTypes.ObjectId,
    },
    mostWickets: {
      ref: "league_player",
      type: SchemaTypes.ObjectId,
    },
  },
  { _id: false },
);

const LeagueTournamentSchema = new Schema<_ILeagueTournament_>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    poster: String,
    league: {
      ref: "league",
      type: SchemaTypes.ObjectId,
    },
    status: String,
    tournamentType: String,
    rounds: {
      type: Number,
      default: 1,
    },
    finalMatch: Boolean,
    overs: {
      type: Number,
      required: true,
    },
    sixes: {
      type: Number,
      default: 0,
    },
    fours: {
      type: Number,
      default: 0,
    },
    playersStat: [PlayerStatSchema],
    pointTable: [PointTableSchema],
    result: ResultSchema,
  },
  { timestamps: true },
);

const LeagueTournament = model<_ILeagueTournament_>("league_tournament", LeagueTournamentSchema);

export { LeagueTournament };
