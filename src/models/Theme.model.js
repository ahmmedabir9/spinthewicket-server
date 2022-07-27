const { Schema, model, SchemaTypes } = require("mongoose");

const ThemeSchema = new Schema(
  {
    logo: String,
    color: String,
    themeType: String,
  },
  { timestamps: true }
);

const Theme = model("theme", ThemeSchema);

module.exports = { Theme };
