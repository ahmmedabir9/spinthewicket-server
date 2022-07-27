const { Schema, model, SchemaTypes } = require("mongoose");

const CountrySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
    },
  },
  { timestamps: true }
);

const Country = model("country", CountrySchema);

module.exports = { Country };
