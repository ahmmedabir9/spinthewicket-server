"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme = void 0;
const mongoose_1 = require("mongoose");
const ThemeSchema = new mongoose_1.Schema({
    logo: String,
    color: String,
    themeType: String,
}, { timestamps: true });
const Theme = (0, mongoose_1.model)("theme", ThemeSchema);
exports.Theme = Theme;
