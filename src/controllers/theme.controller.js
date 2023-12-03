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
const { StatusCodes } = require('http-status-codes');
const { Theme } = require('../models/Theme.model');
const { response } = require('../utils/response');
const getAllThemes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { themeType } = req.query;
    try {
        const query = themeType ? { themeType: themeType.toString() } : {};
        const themes = yield Theme.find(query);
        if (!themes || themes.length === 0) {
            const msg = 'No themes found!';
            return response(res, StatusCodes.NOT_FOUND, false, null, msg);
        }
        return response(res, StatusCodes.OK, true, themes, null);
    }
    catch (error) {
        return response(res, StatusCodes.INTERNAL_SERVER_ERROR, false, null, error.message);
    }
});
module.exports = { getAllThemes };
