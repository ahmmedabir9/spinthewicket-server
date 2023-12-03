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
exports.deleteLeague = exports.getLeagueDetails = exports.getAllLeagues = exports.updateLeague = exports.createLeague = void 0;
const http_status_codes_1 = require("http-status-codes");
const League_model_1 = require("../models/League.model");
const response_1 = require("../utils/response");
// create a league
const createLeague = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, shortName, country, manager, logo, coverPhoto } = req.body;
    if (!title || !shortName || !manager || !logo) {
        let msg = 'Provide all information!';
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, {}, msg);
    }
    try {
        let slug = title.replace(/\s+/g, '-').replace(/\//g, '-').replace(/&/g, 'n').toLowerCase();
        const oldSlug = yield League_model_1.League.findOne({ slug }).select('_id');
        if (oldSlug) {
            const leaguesCount = yield League_model_1.League.countDocuments();
            slug = slug + '-' + leaguesCount.toString();
        }
        const league = yield League_model_1.League.create({
            title,
            shortName,
            slug,
            country,
            managers: [manager],
            logo,
            coverPhoto,
            xp: 0,
            level: 0,
        });
        if (!league) {
            let msg = 'Could not create league!';
            return (0, response_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, null, msg);
        }
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.ACCEPTED, true, { league }, null);
    }
    catch (error) {
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
    }
});
exports.createLeague = createLeague;
//update league
const updateLeague = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title } = req.body;
    try {
        let league = {};
        if (title) {
            league.title = title;
            league.slug = title.replace(/\s+/g, '-').replace(/\//g, '-').replace(/&/g, 'n').toLowerCase();
            const oldSlug = yield League_model_1.League.findOne({ slug: league.slug }).select('_id');
            if (oldSlug) {
                const leaguesCount = yield League_model_1.League.countDocuments();
                league.slug = league.slug + '-' + leaguesCount.toString();
            }
        }
        const newLeague = yield League_model_1.League.findByIdAndUpdate(id, Object.assign(Object.assign({}, req.body), league), {
            new: true,
        }).populate('managers', 'name photo');
        if (!newLeague) {
            let msg = 'could not update league!';
            return (0, response_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, null, msg);
        }
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.ACCEPTED, true, { league: newLeague }, null);
    }
    catch (error) {
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
    }
});
exports.updateLeague = updateLeague;
//get all leagues
const getAllLeagues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { skip, limit, sortBy, searchKey, country, manager } = req.body;
    try {
        const query = League_model_1.League.find();
        if (searchKey) {
            query.or([
                { title: { $regex: searchKey, $options: 'i' } },
                { shortName: { $regex: searchKey, $options: 'i' } },
            ]);
        }
        if (country) {
            query.where({ country });
        }
        if (manager) {
            query.where({ managers: manager });
        }
        query
            .sort(sortBy ? { [sortBy.field]: [sortBy.order] } : { xp: 1 })
            .limit(limit ? limit : undefined)
            .skip(skip ? skip : undefined)
            .select('title shortName country slug logo xp level')
            .populate({
            path: 'country',
            select: 'name code',
        });
        const leagues = yield query;
        if (!leagues || leagues.length === 0) {
            let msg = 'No leagues found!';
            return (0, response_1.response)(res, http_status_codes_1.StatusCodes.NOT_FOUND, false, null, msg);
        }
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.OK, true, { leagues }, null);
    }
    catch (error) {
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
    }
});
exports.getAllLeagues = getAllLeagues;
//get league details
const getLeagueDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    try {
        const league = yield League_model_1.League.findOne({ slug }).populate([
            {
                path: 'country',
                select: 'name code',
            },
            {
                path: 'managers',
                select: 'name photo',
            },
        ]);
        if (!league) {
            let msg = 'No league found!';
            return (0, response_1.response)(res, http_status_codes_1.StatusCodes.NOT_FOUND, false, null, msg);
        }
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.OK, true, { league }, null);
    }
    catch (error) {
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
    }
});
exports.getLeagueDetails = getLeagueDetails;
//delete league
const deleteLeague = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const league = yield League_model_1.League.findByIdAndDelete(id);
        if (!league) {
            let msg = 'Could not delete!';
            return (0, response_1.response)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, false, null, msg);
        }
        // Delete photos here
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.OK, true, { league: { _id: league._id } }, null);
    }
    catch (error) {
        return (0, response_1.response)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
    }
});
exports.deleteLeague = deleteLeague;
