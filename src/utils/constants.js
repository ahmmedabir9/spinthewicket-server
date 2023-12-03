"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialMatchBowlerData = exports.initialMatchBatsmanData = exports.initialLiveData = exports.initialInningData = exports.initialBowlingStat = exports.initialBattingStat = exports.initialTeamData = exports.initialPlayerData = void 0;
const initialPlayerData = {
    trophies: [],
    achievements: [],
};
exports.initialPlayerData = initialPlayerData;
const initialBattingStat = {
    average: 0,
    balls: 0,
    centuries: 0,
    fours: 0,
    halfCenturies: 0,
    innings: 0,
    matches: 0,
    points: 0,
    runs: 0,
    sixes: 0,
    strikeRate: 0,
    dotBall: 0,
    duck: 0,
    notOut: 0,
    catch: 0,
    runOut: 0,
};
exports.initialBattingStat = initialBattingStat;
const initialBowlingStat = {
    average: 0,
    balls: 0,
    economy: 0,
    fiveWickets: 0,
    innings: 0,
    matches: 0,
    points: 0,
    runs: 0,
    threeWickets: 0,
    wickets: 0,
    dotBalls: 0,
    maidens: 0,
};
exports.initialBowlingStat = initialBowlingStat;
const initialTeamData = {
    points: 0,
    trophies: [],
    achievements: [],
    matches: {
        played: 0,
        won: 0,
        lost: 0,
        tied: 0,
        points: 0,
    },
    netRunRate: {
        against: {
            balls: 0,
            overs: 0,
            runs: 0,
        },
        for: {
            balls: 0,
            overs: 0,
            runs: 0,
        },
        nRR: 0,
    },
};
exports.initialTeamData = initialTeamData;
const initialInningData = {
    battingOrder: [],
    bowlingOrder: [],
    partnerships: [],
    fallOfWickets: [],
    overHistory: [],
    overs: 0,
    balls: 0,
    runs: 0,
    wickets: 0,
    runRate: 0,
    extra: 0,
};
exports.initialInningData = initialInningData;
const initialLiveData = {
    batsman: {
        striker: null,
        nonStriker: null,
    },
    bowler: null,
    overs: 0,
    balls: 0,
    runs: 0,
    wickets: 0,
    runRate: 0,
    extra: 0,
    partnership: {
        balls: 0,
        runs: 0,
        batsman1: null,
        batsman2: null,
    },
    freeHit: false,
    history: [],
    spinning: false,
    lastSpinPosition: 0,
};
exports.initialLiveData = initialLiveData;
const initialMatchBatsmanData = {
    balls: 0,
    fours: 0,
    runs: 0,
    sixes: 0,
    dotBalls: 0,
    strikeRate: 0,
};
exports.initialMatchBatsmanData = initialMatchBatsmanData;
const initialMatchBowlerData = {
    balls: 0,
    economy: 0,
    maidens: 0,
    dotBalls: 0,
    overs: 0,
    runs: 0,
    wickets: 0,
};
exports.initialMatchBowlerData = initialMatchBowlerData;
