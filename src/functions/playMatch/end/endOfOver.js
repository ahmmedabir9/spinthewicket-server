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
// const endOfInnings = require('./endOfInnings');
const endOfOver = (matchData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let dataToUpdate = {
            'liveData.bowler': null,
            'liveData.batsman.striker': matchData.liveData.batsman.nonStriker,
            'liveData.batsman.nonStriker': matchData.liveData.batsman.striker,
            'liveData.balls': 0,
            'liveData.thisOver': [],
            'liveData.overs': matchData.liveData.overs + 1,
            [`innings.${matchData.liveData.inning}.overs`]: matchData.liveData.overs + 1,
            [`innings.${matchData.liveData.inning}.balls`]: 0,
            [`innings.${matchData.liveData.inning}.bowlingOrder`]: (0, utils_1.updateBowlingOrder)(matchData, true),
            [`innings.${matchData.liveData.inning}.overHistory`]: (0, utils_1.updateOverHistory)(matchData),
        };
        yield DreamTeamMatch_model_1.DreamTeamMatch.findByIdAndUpdate(matchData._id, dataToUpdate, { new: true });
        // if (updateMatch.liveData.overs === updateMatch.overs || updateMatch.superOver) {
        //   await endOfInnings(updateMatch);
        // }
        return { success: true };
    }
    catch (error) {
        return error;
    }
});
exports.default = endOfOver;
