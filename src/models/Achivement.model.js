const { Schema, model, SchemaTypes } = require("mongoose");

const AchivementSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    achivementType: {
      type: String, //batting, bowling, allround, team
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    previousAchivement: {
      ref: "achivement",
      type: SchemaTypes.ObjectId,
    },
  },
  { timestamps: true },
);

const Achivement = model("achivement", AchivementSchema);

module.exports = { Achivement };
