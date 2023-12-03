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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DreamTeamMatch_model_1 = require("../../../models/DreamTeamMatch.model");
const endOfOver_1 = __importDefault(require("../end/endOfOver"));
const utils_1 = require("../utils");
const dotBall = (matchData, ballData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let dataToUpdate = {
            $inc: {
                'liveData.balls': 1,
                [`innings.${matchData.liveData.inning}.balls`]: 1,
            },
            $push: { 'liveData.thisOver': ballData },
            'liveData.batsman.striker': (0, utils_1.getBatsmanStats)(matchData, 0, 1),
            'liveData.bowler': (0, utils_1.getBowlerStats)(matchData, 0, 1),
            'liveData.runRate': (0, utils_1.getRunRate)(matchData, 0, 1),
            'liveData.partnership': (0, utils_1.getPartnarship)(matchData, 0, 1),
            'liveData.freeHit': false,
            [`innings.${matchData.liveData.inning}.runRate`]: (0, utils_1.getRunRate)(matchData, 0, 1),
        };
        if (matchData.liveData.inning === 'second' || matchData.liveData.inning === 'secondSuper') {
            dataToUpdate = Object.assign(Object.assign({}, dataToUpdate), (0, utils_1.getTargetUpdate)(matchData, 1, 1));
        }
        const updateMatch = yield DreamTeamMatch_model_1.DreamTeamMatch.findByIdAndUpdate(matchData._id, dataToUpdate, { new: true });
        if (updateMatch.liveData.balls === 6) {
            yield (0, endOfOver_1.default)(updateMatch);
        }
        return { success: true };
    }
    catch (error) {
        return error;
    }
});
exports.default = dotBall;
