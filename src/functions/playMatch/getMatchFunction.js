"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchFunction = void 0;
const dotBall_1 = __importDefault(require("./runs/dotBall"));
const fourRuns_1 = __importDefault(require("./runs/fourRuns"));
const noBall_1 = __importDefault(require("./runs/noBall"));
const oneRun_1 = __importDefault(require("./runs/oneRun"));
const sixRuns_1 = __importDefault(require("./runs/sixRuns"));
const threeRuns_1 = __importDefault(require("./runs/threeRuns"));
const twoRuns_1 = __importDefault(require("./runs/twoRuns"));
const wideBall_1 = __importDefault(require("./runs/wideBall"));
const bowled_1 = __importDefault(require("./wickets/bowled"));
const catchOut_1 = __importDefault(require("./wickets/catchOut"));
const lbw_1 = __importDefault(require("./wickets/lbw"));
const runOut_1 = __importDefault(require("./wickets/runOut"));
const getMatchFunction = (ballAction, matchData, ballData) => {
    var _a, _b, _c;
    if (ballAction === 'DOT')
        return (0, dotBall_1.default)(matchData, ballData);
    else if (ballAction === 'ONE')
        return (0, oneRun_1.default)(matchData, ballData);
    else if (ballAction === 'TWO')
        return (0, twoRuns_1.default)(matchData, ballData);
    else if (ballAction === 'THREE')
        return (0, threeRuns_1.default)(matchData, ballData);
    else if (ballAction === 'FOUR')
        return (0, fourRuns_1.default)(matchData, ballData);
    else if (ballAction === 'SIX')
        return (0, sixRuns_1.default)(matchData, ballData);
    else if (ballAction === 'WIDE')
        return (0, wideBall_1.default)(matchData, ballData);
    else if (ballAction === 'NO_BALL')
        return (0, noBall_1.default)(matchData, ballData);
    else if (ballAction === 'BOWLED') {
        if ((_a = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _a === void 0 ? void 0 : _a.freeHit) {
            return (0, dotBall_1.default)(matchData, ballData);
        }
        else {
            return (0, bowled_1.default)(matchData, ballData);
        }
    }
    else if (ballAction === 'LBW') {
        if ((_b = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _b === void 0 ? void 0 : _b.freeHit) {
            return (0, dotBall_1.default)(matchData, ballData);
        }
        else {
            return (0, lbw_1.default)(matchData, ballData);
        }
    }
    else if (ballAction === 'CATCH') {
        if ((_c = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _c === void 0 ? void 0 : _c.freeHit) {
            return (0, dotBall_1.default)(matchData, ballData);
        }
        else {
            return (0, catchOut_1.default)(matchData, ballData);
        }
    }
    else if (ballAction === 'RUN_OUT')
        return (0, runOut_1.default)(matchData, ballData);
};
exports.getMatchFunction = getMatchFunction;
