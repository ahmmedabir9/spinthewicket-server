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
exports.updateMatchData = exports.playMatch = exports.getMatchData = exports.startQuickMatch = void 0;
const http_status_codes_1 = require("http-status-codes");
const ballResult_1 = require("../functions/playMatch/ballResult");
const ballValidation_1 = require("../functions/playMatch/ballValidation");
const getLastSpinPosition_1 = require("../functions/playMatch/getLastSpinPosition");
const getMatchFunction_1 = require("../functions/playMatch/getMatchFunction");
const prepareBallData_1 = require("../functions/playMatch/prepareBallData");
const DreamTeam_model_1 = require("../models/DreamTeam.model");
const DreamTeamMatch_model_1 = require("../models/DreamTeamMatch.model");
const constants_1 = require("../utils/constants");
const response_1 = require("../utils/response");
const socketResponse_1 = require("../utils/socketResponse");
const teamPopulate = [
    { path: 'theme' },
    { path: 'manager' },
    {
        path: 'captain',
        populate: {
            path: 'playerInfo',
        },
    },
    {
        path: 'playingXI',
        populate: {
            path: 'playerInfo',
        },
    },
];
const playerPopulate = [
    {
        path: 'playerInfo',
    },
];
const matchPopulate = [
    { path: 'teams.teamA', populate: teamPopulate },
    { path: 'teams.teamB', populate: teamPopulate },
    { path: 'squad.teamA.playingXI', populate: playerPopulate },
    { path: 'squad.teamB.playingXI', populate: playerPopulate },
    {
        path: 'users',
    },
];
const startQuickMatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    try {
        const { team, overs, user } = req.body;
        if (!team || !overs || !user) {
            let msg = 'provide all informations!';
            return (0, response_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, null, msg);
        }
        //verify and get team
        const dreamTeam = yield DreamTeam_model_1.DreamTeam.findById(team).populate(teamPopulate);
        if (!dreamTeam) {
            return (0, response_1.response)(res, http_status_codes_1.StatusCodes.NOT_FOUND, false, null, 'Dream Team Not Found');
        }
        if (((_b = (_a = dreamTeam === null || dreamTeam === void 0 ? void 0 : dreamTeam.manager) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) !== (user === null || user === void 0 ? void 0 : user.toString())) {
            return (0, response_1.response)(res, http_status_codes_1.StatusCodes.FORBIDDEN, false, null, 'You dont have permission to play with this team!');
        }
        //find opponent
        const botTeams = yield DreamTeam_model_1.DreamTeam.find({
            rating: { $gte: dreamTeam.rating - 5, $lte: dreamTeam.rating + 5 },
            isBot: true,
        }).populate(teamPopulate);
        if ((botTeams === null || botTeams === void 0 ? void 0 : botTeams.length) === 0) {
            return (0, response_1.response)(res, http_status_codes_1.StatusCodes.NOT_FOUND, false, null, 'No Opponent Found');
        }
        const opponentTeam = botTeams[Math.floor(Math.random() * botTeams.length)];
        //prepare match data
        let battingTeam = null, bowlingTeam = null, battingScorer = null, bowlingScorer = null, liveData = Object.assign({}, constants_1.initialLiveData);
        const tossResult = Math.floor(Math.random() * 10000) % 2;
        // const tossResult = Math.floor(Math.random() * 10000) % 2;
        let toss;
        if (tossResult === 0) {
            toss = {
                team: (_c = dreamTeam === null || dreamTeam === void 0 ? void 0 : dreamTeam._id) === null || _c === void 0 ? void 0 : _c.toString(),
                selectedTo: null,
            };
        }
        else {
            const choosen = Math.floor(Math.random() * 10000) % 2;
            toss = {
                team: (_d = opponentTeam === null || opponentTeam === void 0 ? void 0 : opponentTeam._id) === null || _d === void 0 ? void 0 : _d.toString(),
                selectedTo: choosen === 0 ? 'bat' : 'bowl',
            };
            battingTeam = choosen === 0 ? (_e = opponentTeam === null || opponentTeam === void 0 ? void 0 : opponentTeam._id) === null || _e === void 0 ? void 0 : _e.toString() : (_f = dreamTeam === null || dreamTeam === void 0 ? void 0 : dreamTeam._id) === null || _f === void 0 ? void 0 : _f.toString();
            bowlingTeam = choosen === 1 ? (_g = opponentTeam === null || opponentTeam === void 0 ? void 0 : opponentTeam._id) === null || _g === void 0 ? void 0 : _g.toString() : (_h = dreamTeam === null || dreamTeam === void 0 ? void 0 : dreamTeam._id) === null || _h === void 0 ? void 0 : _h.toString();
            battingScorer = choosen === 0 ? null : user;
            bowlingScorer = choosen === 1 ? null : user;
            liveData = Object.assign({ inning: 'first', battingTeam: battingTeam, bowlingTeam: bowlingTeam, battingScorer: battingScorer, bowlingScorer: bowlingScorer }, constants_1.initialLiveData);
        }
        const innings = {
            first: Object.assign({ battingTeam: battingTeam, bowlingTeam: bowlingTeam, battingScorer: battingScorer, bowlingScorer: bowlingScorer }, constants_1.initialInningData),
            second: Object.assign({ battingTeam: bowlingTeam, bowlingTeam: battingTeam, battingScorer: bowlingScorer, bowlingScorer: battingScorer }, constants_1.initialInningData),
        };
        const createdAt = new Date();
        const matchData = {
            title: `${dreamTeam.title} vs ${opponentTeam === null || opponentTeam === void 0 ? void 0 : opponentTeam.title}`,
            matchType: 'quick',
            teams: {
                teamA: (_j = dreamTeam === null || dreamTeam === void 0 ? void 0 : dreamTeam._id) === null || _j === void 0 ? void 0 : _j.toString(),
                teamB: (_k = opponentTeam === null || opponentTeam === void 0 ? void 0 : opponentTeam._id) === null || _k === void 0 ? void 0 : _k.toString(),
            },
            scorers: { a: user, b: null },
            overs: parseInt(overs),
            status: toss.team === ((_l = dreamTeam === null || dreamTeam === void 0 ? void 0 : dreamTeam._id) === null || _l === void 0 ? void 0 : _l.toString()) ? 'toss' : 'live',
            createdAt: createdAt.toString(),
            squad: {
                teamA: {
                    playingXI: (_m = dreamTeam === null || dreamTeam === void 0 ? void 0 : dreamTeam.playingXI) === null || _m === void 0 ? void 0 : _m.map((player) => player === null || player === void 0 ? void 0 : player._id),
                    team: dreamTeam === null || dreamTeam === void 0 ? void 0 : dreamTeam._id,
                },
                teamB: {
                    playingXI: (_o = opponentTeam === null || opponentTeam === void 0 ? void 0 : opponentTeam.playingXI) === null || _o === void 0 ? void 0 : _o.map((player) => player === null || player === void 0 ? void 0 : player._id),
                    team: opponentTeam === null || opponentTeam === void 0 ? void 0 : opponentTeam._id,
                },
            },
            ready: {
                [user === null || user === void 0 ? void 0 : user.toString()]: false,
            },
            users: [user],
            toss: toss,
            liveData: liveData,
            innings,
        };
        //save match data
        const quickMatch = new DreamTeamMatch_model_1.DreamTeamMatch(matchData);
        yield quickMatch.save();
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.ACCEPTED, true, quickMatch, null);
    }
    catch (error) {
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
    }
});
exports.startQuickMatch = startQuickMatch;
const getMatchData = (args) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = args;
        const matchData = yield DreamTeamMatch_model_1.DreamTeamMatch.findById(id);
        return (0, socketResponse_1.socketResponse)(true, matchData, null);
    }
    catch (error) {
        console.log('💡 | file: dreamTeamMatch.controller.ts:220 | error:', error);
        return (0, socketResponse_1.socketResponse)(false, null, error.message);
    }
});
exports.getMatchData = getMatchData;
const updateMatchData = (args, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18;
    try {
        if (!data) {
            return (0, socketResponse_1.socketResponse)(false, null, 'Nothing to Update!');
        }
        const { id } = args;
        const { selectedTo, striker, nonStriker, bowler, user } = data;
        let matchData = yield DreamTeamMatch_model_1.DreamTeamMatch.findById(id);
        let updateData = {};
        // Toss Update
        if (selectedTo) {
            updateData = Object.assign(Object.assign({}, updateData), { 'toss.selectedTo': selectedTo, 'liveData.inning': 'first', 'liveData.battingTeam': selectedTo === 'bowl'
                    ? (_p = matchData.teams.teamB) === null || _p === void 0 ? void 0 : _p.toString()
                    : (_q = matchData.teams.teamA) === null || _q === void 0 ? void 0 : _q.toString(), 'liveData.bowlingTeam': selectedTo === 'bat'
                    ? (_r = matchData.teams.teamB) === null || _r === void 0 ? void 0 : _r.toString()
                    : (_s = matchData.teams.teamA) === null || _s === void 0 ? void 0 : _s.toString(), 'liveData.battingScorer': selectedTo === 'bowl' ? null : user, 'liveData.bowlingScorer': selectedTo === 'bat' ? null : user, 'innings.first.battingTeam': selectedTo === 'bowl'
                    ? (_t = matchData.teams.teamB) === null || _t === void 0 ? void 0 : _t.toString()
                    : (_u = matchData.teams.teamA) === null || _u === void 0 ? void 0 : _u.toString(), 'innings.first.bowlingTeam': selectedTo === 'bat'
                    ? (_v = matchData.teams.teamB) === null || _v === void 0 ? void 0 : _v.toString()
                    : (_w = matchData.teams.teamA) === null || _w === void 0 ? void 0 : _w.toString(), 'innings.first.battingScorer': selectedTo === 'bowl' ? null : user, 'innings.first.bowlingScorer': selectedTo === 'bat' ? null : user, 'innings.second.bowlingTeam': selectedTo === 'bowl'
                    ? (_x = matchData.teams.teamB) === null || _x === void 0 ? void 0 : _x.toString()
                    : (_y = matchData.teams.teamA) === null || _y === void 0 ? void 0 : _y.toString(), 'innings.second.battingTeam': selectedTo === 'bat'
                    ? (_z = matchData.teams.teamB) === null || _z === void 0 ? void 0 : _z.toString()
                    : (_0 = matchData.teams.teamA) === null || _0 === void 0 ? void 0 : _0.toString(), 'innings.second.bowlingScorer': selectedTo === 'bowl' ? null : user, 'innings.second.battingScorer': selectedTo === 'bat' ? null : user });
        }
        // Select Striker
        if (striker) {
            if ((_3 = (_2 = matchData === null || matchData === void 0 ? void 0 : matchData.innings[(_1 = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _1 === void 0 ? void 0 : _1.inning]) === null || _2 === void 0 ? void 0 : _2.battingOrder) === null || _3 === void 0 ? void 0 : _3.find((b) => { var _a; return ((_a = b.id) === null || _a === void 0 ? void 0 : _a.toString()) === (striker === null || striker === void 0 ? void 0 : striker.toString()); })) {
                return (0, socketResponse_1.socketResponse)(false, null, 'Batsman Already Played!');
            }
            updateData = Object.assign(Object.assign({}, updateData), { 'liveData.batsman.striker': Object.assign({ id: striker, inAt: ((_6 = (_5 = matchData === null || matchData === void 0 ? void 0 : matchData.innings[(_4 = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _4 === void 0 ? void 0 : _4.inning]) === null || _5 === void 0 ? void 0 : _5.battingOrder) === null || _6 === void 0 ? void 0 : _6.length) + 1 }, constants_1.initialMatchBatsmanData) });
        }
        // Select NonStriker
        if (nonStriker) {
            if ((_9 = (_8 = matchData === null || matchData === void 0 ? void 0 : matchData.innings[(_7 = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _7 === void 0 ? void 0 : _7.inning]) === null || _8 === void 0 ? void 0 : _8.battingOrder) === null || _9 === void 0 ? void 0 : _9.find((b) => { var _a; return ((_a = b.id) === null || _a === void 0 ? void 0 : _a.toString()) === (nonStriker === null || nonStriker === void 0 ? void 0 : nonStriker.toString()); })) {
                return (0, socketResponse_1.socketResponse)(false, null, 'Batsman Already Played!');
            }
            updateData = Object.assign(Object.assign({}, updateData), { 'liveData.batsman.nonStriker': Object.assign({ id: nonStriker, inAt: ((_12 = (_11 = matchData === null || matchData === void 0 ? void 0 : matchData.innings[(_10 = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _10 === void 0 ? void 0 : _10.inning]) === null || _11 === void 0 ? void 0 : _11.battingOrder) === null || _12 === void 0 ? void 0 : _12.length) +
                        (!((_15 = (_14 = matchData === null || matchData === void 0 ? void 0 : matchData.innings[(_13 = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _13 === void 0 ? void 0 : _13.inning]) === null || _14 === void 0 ? void 0 : _14.battingOrder) === null || _15 === void 0 ? void 0 : _15.length) ? 2 : 1) }, constants_1.initialMatchBatsmanData) });
        }
        // Select Bowler
        if (bowler) {
            let newBolwer = ((_18 = (_17 = matchData === null || matchData === void 0 ? void 0 : matchData.innings[(_16 = matchData === null || matchData === void 0 ? void 0 : matchData.liveData) === null || _16 === void 0 ? void 0 : _16.inning]) === null || _17 === void 0 ? void 0 : _17.bowlingOrder) === null || _18 === void 0 ? void 0 : _18.find((b) => { var _a; return ((_a = b.id) === null || _a === void 0 ? void 0 : _a.toString()) === (bowler === null || bowler === void 0 ? void 0 : bowler.toString()); })) || Object.assign(Object.assign({}, constants_1.initialMatchBowlerData), { id: bowler });
            if ((newBolwer === null || newBolwer === void 0 ? void 0 : newBolwer.overs) === ((matchData === null || matchData === void 0 ? void 0 : matchData.overs) / 5).toFixed(0)) {
                return (0, socketResponse_1.socketResponse)(false, null, 'No Over Left to Bowl!');
            }
            updateData = Object.assign(Object.assign({}, updateData), { 'liveData.bowler': newBolwer });
        }
        matchData = yield DreamTeamMatch_model_1.DreamTeamMatch.findByIdAndUpdate(id, updateData, { new: true });
        return (0, socketResponse_1.socketResponse)(true, matchData, null);
    }
    catch (error) {
        return (0, socketResponse_1.socketResponse)(false, null, error.message);
    }
});
exports.updateMatchData = updateMatchData;
const playMatch = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { match, bat, bowl } = data;
        if (!match || !bat || !bowl) {
            return (0, socketResponse_1.socketResponse)(false, null, 'Provide all Data!');
        }
        let matchData = yield DreamTeamMatch_model_1.DreamTeamMatch.findById(match);
        if (!matchData) {
            return (0, socketResponse_1.socketResponse)(false, null, 'Match Not Found!');
        }
        // BROADCAST SPINNING RESPONSE
        if ((0, ballValidation_1.ballValidation)(matchData)) {
            // const ballAction = 'WIDE';
            const ballAction = (0, ballResult_1.ballResult)(bat, bowl);
            console.log('💡 | file: dreamTeamMatch.controller.ts:301 | ballAction:', ballAction);
            if (!ballAction)
                return (0, socketResponse_1.socketResponse)(false, null, 'Failed to generate ball result!');
            const lastSpinPosition = (0, getLastSpinPosition_1.getLastSpinPosition)(ballAction);
            const ballData = (0, prepareBallData_1.prepareBallData)(matchData, ballAction);
            let ballResponse = yield (0, getMatchFunction_1.getMatchFunction)(ballAction, matchData, ballData);
            console.log('💡 | file: dreamTeamMatch.controller.ts:343 | ballResponse:', ballResponse);
            if (!(ballResponse === null || ballResponse === void 0 ? void 0 : ballResponse.success)) {
                return (0, socketResponse_1.socketResponse)(false, null, ballResponse === null || ballResponse === void 0 ? void 0 : ballResponse.message);
            }
            const updateData = {
                'liveData.lastSpinPosition': lastSpinPosition,
                'liveData.spinning': false,
            };
            matchData = yield DreamTeamMatch_model_1.DreamTeamMatch.findByIdAndUpdate(matchData._id, updateData, {
                new: true,
            }).select('innings liveData title');
            //BROADCAST THE UPDATED DATA
            return (0, socketResponse_1.socketResponse)(true, matchData, '');
        }
        else {
            return (0, socketResponse_1.socketResponse)(false, null, 'Invalid Play!');
        }
    }
    catch (error) {
        console.log('💡 | file: dreamTeamMatch.controller.ts:354 | error:', error);
        return (0, socketResponse_1.socketResponse)(false, null, 'Server Error!');
    }
});
exports.playMatch = playMatch;
