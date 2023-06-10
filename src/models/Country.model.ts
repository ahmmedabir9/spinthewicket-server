import { Schema, model } from "mongoose";

import { _ICountry_ } from "./_ModelTypes_";

const CountrySchema = new Schema<_ICountry_>(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
    },
  },
  { timestamps: true },
);

const Country = model<_ICountry_>("Country", CountrySchema);

export default Country;
