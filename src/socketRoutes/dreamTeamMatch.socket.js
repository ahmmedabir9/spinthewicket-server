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
exports.DreamTeamMatchSocketRoutes = void 0;
const dreamTeamMatch_controller_1 = require("../controllers/dreamTeamMatch.controller");
const socketService_1 = require("../services/socketService");
class DreamTeamMatchSocketRoutes extends socketService_1.SocketRoutes {
    constructor(app) {
        super(app, 'dreamTeamMatch');
        this.addMethod('getMatchData');
        this.addMethod('updateMatchData');
        this.addMethod('playMatch');
    }
    getMatchData(responder, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            responder.respond(yield (0, dreamTeamMatch_controller_1.getMatchData)(data['args']));
        });
    }
    updateMatchData(responder, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            responder.respond(yield (0, dreamTeamMatch_controller_1.updateMatchData)(data['args'], data['data']));
        });
    }
    playMatch(responder, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            responder.respond(yield (0, dreamTeamMatch_controller_1.playMatch)(data['data']));
        });
    }
}
exports.DreamTeamMatchSocketRoutes = DreamTeamMatchSocketRoutes;
