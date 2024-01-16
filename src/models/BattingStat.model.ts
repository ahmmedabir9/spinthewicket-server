import { Schema, SchemaTypes, model } from 'mongoose';

import { _IBattingStat_ } from './_ModelTypes_';

const BattingStatSchema = new Schema<_IBattingStat_>(
  {
    average: { type: Number, default: 0 },
    balls: { type: Number, default: 0 },
    best: {
      runs: { type: Number, default: 0 },
      balls: { type: Number, default: 0 },
      match: {
        ref: 'Match',
        type: SchemaTypes.ObjectId,
      },
    },
    centuries: { type: Number, default: 0 },
    fours: { type: Number, default: 0 },
    halfCenturies: { type: Number, default: 0 },
    innings: { type: Number, default: 0 },
    matches: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    sixes: { type: Number, default: 0 },
    strikeRate: { type: Number, default: 0 },
    dotBalls: { type: Number, default: 0 },
    ducks: { type: Number, default: 0 },
    notOuts: { type: Number, default: 0 },
    catches: { type: Number, default: 0 },
    runOuts: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const BattingStat = model<_IBattingStat_>('batting_stat', BattingStatSchema);

export default BattingStat;
