import { Schema, SchemaTypes, model } from 'mongoose';

import { _IUser_ } from './_ModelTypes_';

const UserSchema = new Schema<_IUser_>(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
    },
    nationality: {
      ref: 'Country',
      type: SchemaTypes.ObjectId,
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: (value: string) => {
          // Regular expression to validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: 'Invalid email format',
      },
    },
    uid: String,
    phone: String,
    photo: String,
    achievements: [
      {
        achievement: {
          ref: 'Achievement',
          type: SchemaTypes.ObjectId,
        },
        date: Date,
      },
    ],
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const User = model<_IUser_>('user', UserSchema);

export default User;
