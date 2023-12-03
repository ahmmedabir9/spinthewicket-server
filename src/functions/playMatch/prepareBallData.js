"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareBallData = void 0;
const prepareBallData = (matchData, ballAction) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    let ball = {
        bowler: matchData.liveData.bowler.id,
        batsman: matchData.liveData.batsman.striker.id,
        status: ballAction,
        overNo: matchData.liveData.overs,
        wickets: matchData.liveData.wickets,
        totalRuns: matchData.liveData.runs,
        run: 0,
        ballNo: matchData.liveData.balls + 1,
    };
    if (ballAction === 'ONE') {
        ball.run = 1;
        ball.totalRuns = ((_a = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _a === void 0 ? void 0 : _a.runs) + 1;
    }
    else if (ballAction === 'BOWLED') {
        ball.wickets = ((_b = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _b === void 0 ? void 0 : _b.wickets) + (!matchData.liveData.freeHit ? 1 : 0);
    }
    else if (ballAction === 'SIX') {
        ball.run = 6;
        ball.totalRuns = ((_c = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _c === void 0 ? void 0 : _c.runs) + 6;
    }
    else if (ballAction === 'WIDE') {
        ball.run = 1;
        ball.totalRuns = ((_d = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _d === void 0 ? void 0 : _d.runs) + 1;
        ball.ballNo = (_e = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _e === void 0 ? void 0 : _e.balls;
    }
    else if (ballAction === 'RUN_OUT') {
        ball.wickets = ((_f = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _f === void 0 ? void 0 : _f.wickets) + 1;
    }
    else if (ballAction === 'TWO') {
        ball.run = 2;
        ball.totalRuns = ((_g = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _g === void 0 ? void 0 : _g.runs) + 2;
    }
    else if (ballAction === 'THREE') {
        ball.run = 3;
        ball.totalRuns = ((_h = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _h === void 0 ? void 0 : _h.runs) + 3;
    }
    else if (ballAction === 'LBW') {
        ball.wickets = ((_j = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _j === void 0 ? void 0 : _j.wickets) + (!matchData.liveData.freeHit ? 1 : 0);
    }
    else if (ballAction === 'NO_BALL') {
        ball.run = 1;
        ball.totalRuns = ((_k = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _k === void 0 ? void 0 : _k.runs) + 1;
        ball.ballNo = (_l = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _l === void 0 ? void 0 : _l.balls;
    }
    else if (ballAction === 'FOUR') {
        ball.run = 4;
        ball.totalRuns = ((_m = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _m === void 0 ? void 0 : _m.runs) + 4;
    }
    else if (ballAction === 'CATCH') {
        ball.wickets = ((_o = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _o === void 0 ? void 0 : _o.wickets) + (!matchData.liveData.freeHit ? 1 : 0);
    }
    return ball;
};
exports.prepareBallData = prepareBallData;
