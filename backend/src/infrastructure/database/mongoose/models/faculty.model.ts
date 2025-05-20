import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IFaculty extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
}

const facultySchema = new Schema<IFaculty>({
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

// Pre-save middleware to hash password
facultySchema.pre('save', async function (next) {
  const faculty = this as IFaculty;

  // Only hash the password if it has been modified (or is new)
  if (!faculty.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    faculty.password = await bcrypt.hash(faculty.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

export const Faculty = mongoose.model<IFaculty>('Faculty', facultySchema);