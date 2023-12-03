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
exports.response = void 0;
const http_status_codes_1 = require("http-status-codes");
const response = (res, code, status, data, message) => __awaiter(void 0, void 0, void 0, function* () {
    if (!message) {
        message = (0, http_status_codes_1.getReasonPhrase)(code);
    }
    return res.status(code).json({
        status: status,
        data: data,
        message: message,
    });
});
exports.response = response;
