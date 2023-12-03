"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AchievementSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    achievementType: {
        type: String,
        required: true,
        enum: ["batting", "bowling", "allround", "team"], // Restrict to specific values
    },
    level: {
        type: Number,
        required: true,
    },
    previousAchievement: {
        ref: "achievement",
        type: mongoose_1.SchemaTypes.ObjectId,
    },
}, { timestamps: true });
const Achievement = (0, mongoose_1.model)("achievement", AchievementSchema);
exports.default = Achievement;
