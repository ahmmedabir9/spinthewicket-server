const { Schema, model, SchemaTypes } = require("mongoose");

const DefaultTeamSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    isActive: Boolean,
    logo: String,
    league: {
      ref: "default_league",
      type: SchemaTypes.ObjectId,
    },
  },
  { timestamps: true },
);

const DefaultLeagueSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    logo: String,
  },
  { timestamps: true },
);

const DefaultLeague = model("default_league", DefaultLeagueSchema);
const DefaultTeam = model("default_team", DefaultTeamSchema);

module.exports = { DefaultTeam };
