"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DreamTeamMatch_model_1 = require("../../../models/DreamTeamMatch.model");
const utils_1 = require("../utils");
// * FROM :: LAST BALL, LAST WICKET, RUN CHASED
const endOfInnings = (matchData) => __awaiter(void 0, void 0, void 0, function* () {
    // * PUSH BATTING ORDER
    let batsman = [];
    if (matchData.liveData.batsman.striker.id)
        batsman.push(Object.assign(Object.assign({}, (0, utils_1.getBatsmanStats)(matchData, 0, 0)), { status: 'notout' }));
    if (matchData.liveData.batsman.nonStriker.id)
        batsman.push(Object.assign(Object.assign({}, (0, utils_1.getBatsmanStats)(matchData, 0, 0, null, true)), { status: 'notout' }));
    let bowler;
    // * PUSH BOWLING ORDER
    if (matchData.liveData.bowler.id)
        bowler = (0, utils_1.getBowlerStats)(matchData, 0, 0);
    let dataToUpdate = {
        'liveData.bowler': null,
        'liveData.extra': 0,
        'liveData.runRate': 0,
        'liveData.batsman.striker': null,
        'liveData.batsman.nonStriker': null,
        'liveData.balls': 0,
        'liveData.overs': 0,
        'liveData.freeHit': null,
        'liveData.battingTeam': matchData.liveData.bowlingTeam,
        'liveData.bowlingTeam': matchData.liveData.battingTeam,
        'liveData.battingScorer': matchData.liveData.bowlingScorer,
        'liveData.bowlingScorer': matchData.liveData.battingScorer,
        'liveData.runs': 0,
        'liveData.wickets': 0,
        'liveData.partnership': {
            runs: 0,
            balls: 0,
            batsman1: null,
            batsman2: null,
        },
        'liveData.thisOver': [],
        $push: {
            [`innings.${matchData.liveData.inning}.bowlingOrder`]: bowler,
            [`innings.${matchData.liveData.inning}.battingOrder`]: [...batsman],
            [`innings.${matchData.liveData.inning}.partnerships`]: (0, utils_1.getPartnarship)(matchData, 0, 0),
        },
        [`innings.${matchData.liveData.inning}.overHistory`]: (0, utils_1.updateOverHistory)(matchData),
    };
    // * IF FIRST INNING, EXCHANGE BATTING/BOWLING TEAM ON LIVE DATA
    // * IF FIRST INNING, CALCULATE TARGET
    if (matchData.liveData.inning === 'first' || matchData.liveData.inning === 'firstSuper') {
        dataToUpdate = Object.assign(Object.assign({}, dataToUpdate), { 'liveData.target': matchData.liveData.runs + 1, 'liveData.inning': matchData.liveData.inning === 'first' ? 'second' : 'secondSuper', 'liveData.need': matchData.liveData.runs + 1, 'liveData.from': matchData.overs * 6, 'liveData.reqRR': (matchData.liveData.runs + 1) / matchData.overs });
    }
    // * IF SECOND INNINGS, CALCULATE RESULT, START SUPER IF TIE, OR END MATCH
    // *
    if (matchData.liveData.inning === 'second' || matchData.liveData.inning === 'secondSuper') {
        // * RESULT
        const firstInning = matchData.liveData.inning === 'secondSuper' ? 'firstSuper' : 'first';
        const secondInning = matchData.liveData.inning === 'secondSuper' ? 'secondSuper' : 'second';
        if (matchData.innings[firstInning].runs > matchData.innings[secondInning].runs) {
            dataToUpdate = Object.assign(Object.assign({}, dataToUpdate), { result: {
                    winner: matchData.innings[firstInning].battingTeam,
                    wonBy: firstInning === 'firstSuper' ? 'superOver' : 'runs',
                    runs: matchData.innings[firstInning].runs - matchData.innings[secondInning].runs,
                }, liveData: null, status: 'completed' });
        }
        else if (matchData.innings[firstInning].runs < matchData.innings[secondInning].runs) {
            dataToUpdate = Object.assign(Object.assign({}, dataToUpdate), { result: {
                    winner: matchData.innings[secondInning].battingTeam,
                    wonBy: firstInning === 'firstSuper' ? 'superOver' : 'wickets',
                    runs: 10 - matchData.innings[secondInning].wickets,
                }, liveData: null, status: 'completed' });
        }
        else {
            dataToUpdate = Object.assign(Object.assign({}, dataToUpdate), { 'liveData.inning': 'firstSuper', 'liveData.target': null, 'liveData.need': null, 'liveData.from': null, 'liveData.reqRR': null, 'innings.firstSuper': {
                    battingTeam: matchData.innings.second.battingTeam,
                    bowlingTeam: matchData.innings.first.battingTeam,
                    battingScorer: matchData.innings.second.battingScorer,
                    bowlingScorer: matchData.innings.second.bowlingScorer,
                    battingOrder: [],
                    bowlingOrder: [],
                    partnerships: [],
                    fallOfWickets: [],
                    ballByBall: [],
                    overs: 0,
                    balls: 0,
                    runs: 0,
                    wickets: 0,
                    runRate: 0,
                    extra: 0,
                }, 'innings.secondSuper': {
                    battingTeam: matchData.innings.first.battingTeam,
                    bowlingTeam: matchData.innings.second.battingTeam,
                    battingScorer: matchData.innings.first.battingScorer,
                    bowlingScorer: matchData.innings.first.bowlingScorer,
                    battingOrder: [],
                    bowlingOrder: [],
                    partnerships: [],
                    fallOfWickets: [],
                    ballByBall: [],
                    overs: 0,
                    balls: 0,
                    runs: 0,
                    wickets: 0,
                    runRate: 0,
                    extra: 0,
                } });
        }
        const newMatchData = yield DreamTeamMatch_model_1.DreamTeamMatch.findByIdAndUpdate(matchData._id, dataToUpdate, {
            new: true,
        });
        if (newMatchData.status === 'completed') {
            // SAVE MATCH DATA HERE
        }
    }
});
exports.default = endOfInnings;
