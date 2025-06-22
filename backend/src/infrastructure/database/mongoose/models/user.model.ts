import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  phone?: string;
  profilePicture?: string;
  passwordChangedAt?: Date;
  fcmTokens: string[];
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
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  password: { type: String, required: true, minlength: 8 },
  createdAt: { type: Date, default: Date.now },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[0-9\- ]{7,15}$/, "Please use a valid phone number"],
  },
  profilePicture: {
    type: String,
    trim: true,
  },
  passwordChangedAt: { type: Date },
  fcmTokens: [{ type: String }],
});

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  const user = this as IUser;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    // Set passwordChangedAt when password is modified
    user.passwordChangedAt = new Date();
    next();
  } catch (err) {
    next(err as Error);
  }
});

export const User = mongoose.model<IUser>("User", userSchema);
