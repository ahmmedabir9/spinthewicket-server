import { Schema, model } from "mongoose";
import { _ITheme_ } from "./_ModelTypes_";

const ThemeSchema = new Schema<_ITheme_>(
  {
    logo: String,
    color: String,
    themeType: String,
  },
  { timestamps: true },
);

const Theme = model<_ITheme_>("theme", ThemeSchema);

export { Theme };
