import mongoose, { Schema, Document } from 'mongoose';

export interface IRegister extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  pending: boolean;
}

const registerSchema = new Schema<IRegister>({
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
  pending: { type: Boolean, default: true },
});

export const Register = mongoose.model<IRegister>('Register', registerSchema);