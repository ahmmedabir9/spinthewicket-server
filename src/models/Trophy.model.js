const { Schema, model, SchemaTypes } = require("mongoose");

const TrophySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    trophyType: {
      type: String, //champion, runnerup, motm, mots, mostruns, mostwickets
      required: true,
    },
    tournament: {
      ref: "league_tournament",
      type: SchemaTypes.ObjectId,
    },
    match: {
      ref: "match",
      type: SchemaTypes.ObjectId,
    },
    league: {
      ref: "league",
      type: SchemaTypes.ObjectId,
    },
  },
  { timestamps: true },
);

const Trophy = model("trophy", TrophySchema);

module.exports = { Trophy };
