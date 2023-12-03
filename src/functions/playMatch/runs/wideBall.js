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
const wideBall = (matchData, ballData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let dataToUpdate = {
            $inc: {
                'liveData.runs': 1,
                'liveData.extra': 1,
                [`innings.${matchData.liveData.inning}.extra`]: 1,
                [`innings.${matchData.liveData.inning}.runs`]: 1,
            },
            $push: { 'liveData.thisOver': ballData },
            'liveData.bowler': (0, utils_1.getBowlerStats)(matchData, 1, 0),
            'liveData.partnership': (0, utils_1.getPartnarship)(matchData, 1, 0),
            'liveData.runRate': (0, utils_1.getRunRate)(matchData, 1, 0),
            [`innings.${matchData.liveData.inning}.runRate`]: (0, utils_1.getRunRate)(matchData, 1, 0),
        };
        if (matchData.liveData.inning === 'second' || matchData.liveData.inning === 'secondSuper') {
            dataToUpdate = Object.assign(Object.assign({}, dataToUpdate), (0, utils_1.getTargetUpdate)(matchData, 1, 0));
        }
        const updateMatch = yield DreamTeamMatch_model_1.DreamTeamMatch.findByIdAndUpdate(matchData._id, dataToUpdate, { new: true });
        // if (updateMatch.liveData.need <= 0) {
        //   await runChased(updateMatch, inning);
        // }
        return { success: true };
    }
    catch (error) {
        return error;
    }
});
exports.default = wideBall;
