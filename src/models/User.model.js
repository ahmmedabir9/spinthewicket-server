"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
    },
    nationality: {
        ref: 'Country',
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    email: {
        type: String,
        unique: true,
        validate: {
            validator: (value) => {
                // Regular expression to validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: 'Invalid email format',
        },
    },
    uid: String,
    phone: String,
    photo: String,
    achievements: [
        {
            achievement: {
                ref: 'Achievement',
                type: mongoose_1.SchemaTypes.ObjectId,
            },
            date: Date,
        },
    ],
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
}, { timestamps: true });
const User = (0, mongoose_1.model)('user', UserSchema);
exports.default = User;
