const { Schema, model, SchemaTypes } = require("mongoose");

const LeagueTournamentSchema = new Schema(
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
    status: String, // running, completed
    tournamentType: String, //leagueTour, customTour, series
    rounds: { type: Number, default: 1 },
    finalMatch: Boolean,
    overs: { type: Number, required: true },
    sixes: { type: Number, default: 0 },
    fours: { type: Number, default: 0 },
    playersStat: [
      {
        player: {
          ref: "league_player",
          type: SchemaTypes.ObjectId,
        },
        team: {
          ref: "league_team",
          type: SchemaTypes.ObjectId,
        },
        sixes: { type: Number, default: 0 },
        fours: { type: Number, default: 0 },
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        performance: { type: Number, default: 0 },
      },
    ],
    pointTable: [
      {
        team: {
          ref: "league_team",
          type: SchemaTypes.ObjectId,
        },
        played: { type: Number, default: 0 },
        won: { type: Number, default: 0 },
        lost: { type: Number, default: 0 },
        tied: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
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
      },
    ],
    result: {
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
  },
  { timestamps: true }
);

const LeagueTournament = model("league_tournament", LeagueTournamentSchema);

module.exports = { LeagueTournament };
