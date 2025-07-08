import mongoose, { Schema, Document } from 'mongoose';
import { IAdmin } from "../../../../domain/auth/entities/AuthTypes";

const adminSchema = new Schema<IAdmin>({
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
});

export const Admin = mongoose.model<IAdmin>('Admin', adminSchema);