"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ballValidation = void 0;
const ballValidation = (matchData) => {
    var _a, _b, _c;
    if (matchData.liveData) {
        if (((_a = matchData.liveData.batsman.striker) === null || _a === void 0 ? void 0 : _a.id) &&
            ((_b = matchData.liveData.batsman.nonStriker) === null || _b === void 0 ? void 0 : _b.id) &&
            ((_c = matchData.liveData.bowler) === null || _c === void 0 ? void 0 : _c.id) &&
            matchData.liveData.balls !== 6 &&
            !matchData.liveData.spinning) {
            return true;
        }
        else {
            return false;
        }
    }
};
exports.ballValidation = ballValidation;
