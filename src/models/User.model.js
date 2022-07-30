const { Schema, model, SchemaTypes } = require("mongoose");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
    },
    nationality: {
      ref: "country",
      type: SchemaTypes.ObjectId,
    },
    email: {
      type: String,
    },
    uid: String,
    phone: String,
    photo: String,
    achivements: [
      {
        achivement: {
          ref: "achivement",
          type: SchemaTypes.ObjectId,
        },
        date: Date,
      },
    ],
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = model("user", UserSchema);

module.exports = { User };
