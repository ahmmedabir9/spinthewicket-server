"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CountrySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
    },
}, { timestamps: true });
const Country = (0, mongoose_1.model)("Country", CountrySchema);
exports.default = Country;
