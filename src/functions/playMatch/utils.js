"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFallOfWicket = exports.getTargetUpdate = exports.updateOverHistory = exports.updateBowlingOrder = exports.getBowlerStats = exports.getBatsmanStats = exports.getPartnarship = exports.getRunRate = exports.getEconomy = exports.getStrikeRate = void 0;
const getBatsmanStats = (matchData, run, ball, out, nonStriker) => {
    let stats = matchData.liveData.batsman[nonStriker ? 'nonStriker' : 'striker'];
    stats.balls = stats.balls + ball;
    stats.runs = stats.runs + run;
    stats.fours = stats.fours + (run === 4 ? 1 : 0);
    stats.sixes = stats.sixes + (run === 6 ? 1 : 0);
    stats.dotBalls = stats.dotBalls + (run === 0 ? 1 : 0);
    stats.strikeRate = getStrikeRate(matchData, run, ball);
    if (out) {
        stats.status = 'out';
        stats.out = {
            bowler: matchData.liveData.bowler.id,
            wicketType: out,
        };
        if (out === 'CATCH' || out === 'RUN_OUT') {
            const index = Math.floor(Math.random() * 100) % 11;
            const team = matchData.liveData.bowlingTeam === matchData.teams.teamA ? 'teamA' : 'teamB';
            stats.fielder = matchData.squad[team].playingXI[index];
        }
    }
    return stats;
};
exports.getBatsmanStats = getBatsmanStats;
const getBowlerStats = (matchData, run, ball, wicket) => {
    let stats = matchData.liveData.bowler;
    stats.balls = stats.balls + ball;
    stats.runs = stats.runs + run;
    stats.wickets = stats.wickets + (wicket || 0);
    stats.fours = stats.fours + (run === 4 ? 1 : 0);
    stats.sixes = stats.sixes + (run === 6 ? 1 : 0);
    stats.dotBalls = stats.dotBalls + (run === 0 ? 1 : 0);
    stats.economy = getEconomy(matchData, run, ball);
    return stats;
};
exports.getBowlerStats = getBowlerStats;
const updateBowlingOrder = (matchData, endOfOver) => {
    let bowlingOrder = matchData.innings[matchData.liveData.inning].bowlingOrder || [];
    bowlingOrder = bowlingOrder.filter((b) => { var _a; return ((_a = b.id) === null || _a === void 0 ? void 0 : _a.toString()) !== matchData.liveData.bowler.id; });
    if (!matchData.liveData.bowler.runs)
        matchData.liveData.bowler.maidens++;
    if (endOfOver) {
        matchData.liveData.bowler.overs++;
        matchData.liveData.bowler.balls = 0;
    }
    bowlingOrder.push(matchData.liveData.bowler);
    return bowlingOrder;
};
exports.updateBowlingOrder = updateBowlingOrder;
const updateOverHistory = (matchData) => {
    let overHistory = matchData.innings[matchData.liveData.inning].overHistory || [];
    overHistory.push(matchData.liveData.thisOver);
    return overHistory;
};
exports.updateOverHistory = updateOverHistory;
const getStrikeRate = (matchData, run, ball) => {
    return (((matchData.liveData.batsman.striker.runs + run) /
        (matchData.liveData.batsman.striker.balls + ball)) *
        100);
};
exports.getStrikeRate = getStrikeRate;
const getEconomy = (matchData, run, ball) => {
    return ((matchData.liveData.bowler.runs + run) /
        ((matchData.liveData.bowler.overs * 6 + (matchData.liveData.bowler.balls + ball)) / 6));
};
exports.getEconomy = getEconomy;
const getRunRate = (matchData, run, ball) => {
    return ((matchData.liveData.runs + run) /
        ((matchData.liveData.overs * 6 + (matchData.liveData.balls + ball)) / 6));
};
exports.getRunRate = getRunRate;
const getPartnarship = (matchData, run, ball) => {
    return {
        runs: (matchData.liveData.partnership.runs || 0) + run,
        balls: (matchData.liveData.partnership.balls || 0) + ball,
        batsman1: matchData.liveData.batsman.striker.id,
        batsman2: matchData.liveData.batsman.nonStriker.id,
    };
};
exports.getPartnarship = getPartnarship;
const getFallOfWicket = (matchData, player, ball) => {
    return {
        runs: matchData.liveData.runs,
        balls: matchData.liveData.balls + ball,
        player: player,
        overs: matchData.liveData.overs,
    };
};
exports.getFallOfWicket = getFallOfWicket;
const getTargetUpdate = (matchData, run, ball) => {
    return {
        'liveData.need': matchData.liveData.need - run,
        'liveData.from': matchData.liveData.from - ball,
        'liveData.reqRR': (matchData.liveData.need - run) / ((matchData.liveData.from - ball) / 6),
    };
};
exports.getTargetUpdate = getTargetUpdate;
