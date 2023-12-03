"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeagueTournament = void 0;
const mongoose_1 = require("mongoose");
const AgainstStatsSchema = new mongoose_1.Schema({
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
}, { _id: false });
const ForStatsSchema = new mongoose_1.Schema({
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
}, { _id: false });
const NetRunRateSchema = new mongoose_1.Schema({
    against: AgainstStatsSchema,
    for: ForStatsSchema,
    nRR: {
        type: Number,
        default: 0,
    },
}, { _id: false });
const PlayerStatSchema = new mongoose_1.Schema({
    player: {
        ref: "league_player",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    team: {
        ref: "league_team",
        type: mongoose_1.SchemaTypes.ObjectId,
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
}, { _id: false });
const PointTableSchema = new mongoose_1.Schema({
    team: {
        ref: "league_team",
        type: mongoose_1.SchemaTypes.ObjectId,
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
}, { _id: false });
const ResultSchema = new mongoose_1.Schema({
    champion: {
        ref: "league_team",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    runnerUp: {
        ref: "league_team",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    manOfTheSeries: {
        ref: "league_player",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    mostRuns: {
        ref: "league_player",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    mostWickets: {
        ref: "league_player",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
}, { _id: false });
const LeagueTournamentSchema = new mongoose_1.Schema({
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
        type: mongoose_1.SchemaTypes.ObjectId,
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
}, { timestamps: true });
const LeagueTournament = (0, mongoose_1.model)("league_tournament", LeagueTournamentSchema);
exports.LeagueTournament = LeagueTournament;
