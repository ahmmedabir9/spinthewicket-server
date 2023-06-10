import { Schema, model, SchemaTypes } from "mongoose";
import { _IAchievement_ } from "./_ModelTypes_";

const AchievementSchema = new Schema<_IAchievement_>(
  {
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
      type: SchemaTypes.ObjectId,
    },
  },
  { timestamps: true },
);

const Achievement = model<_IAchievement_>("achievement", AchievementSchema);

export default Achievement;
