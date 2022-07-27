const { Schema, model, SchemaTypes } = require("mongoose");

const GlobalLeagueSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    shortName: {
      type: String,
    },
    country: {
      type: SchemaTypes.ObjectId,
      ref: "country",
    },
    slug: {
      type: String,
      required: true,
    },
    logo: String,
  },
  { timestamps: true }
);

const GlobalLeague = model("global_league", GlobalLeagueSchema);

module.exports = { GlobalLeague };
