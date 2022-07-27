const { Schema, model, SchemaTypes } = require("mongoose");

const GlobalTeamSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    shortName: {
      type: String,
      required: true,
    },
    logo: String,
    captain: {
      ref: "league_player",
      type: SchemaTypes.ObjectId,
    },
  },
  { timestamps: true }
);

const GlobalTeam = model("global_team", GlobalTeamSchema);

module.exports = { GlobalTeam };
