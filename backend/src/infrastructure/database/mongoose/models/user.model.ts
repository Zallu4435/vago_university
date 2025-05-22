import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  phone?: string;
  profilePicture?: string;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  password: { type: String, required: true, minlength: 8 },
  createdAt: { type: Date, default: Date.now },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[0-9\- ]{7,15}$/, 'Please use a valid phone number'],
  },
  profilePicture: {
    type: String,
    trim: true,
  },
});

export const User = mongoose.model<IUser>('User', userSchema);