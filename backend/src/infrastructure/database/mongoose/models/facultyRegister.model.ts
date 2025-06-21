import mongoose, { Schema, Document } from "mongoose";

interface IFacultyRegister extends Document {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  qualification: string;
  experience: string;
  aboutMe: string;
  password: string;
  cvUrl?: string;
  certificatesUrl?: string[];
  status: "pending" | "offered" | "approved" | "rejected";
  rejectedBy: "admin" | "user" | null;
  confirmationToken: string | null;
  tokenExpiry: Date | null;
}

const FacultyRegisterSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    department: { type: String, required: true },
    qualification: { type: String, required: true },
    experience: { type: String, required: true },
    aboutMe: { type: String, required: true },
    password: { type: String, required: false },
    cvUrl: { type: String },
    certificatesUrl: { type: [String] },
    rejectedBy: {
      type: String,
      enum: ["admin", "user", null],
      default: null,
    },

    // ✅ Added "offered" to represent email offer sent but waiting for user confirmation
    status: {
      type: String,
      enum: ["pending", "offered", "approved", "rejected"],
      default: "pending",
    },
    confirmationToken: { type: String, default: null },
    tokenExpiry: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export const FacultyRegister = mongoose.model<IFacultyRegister>(
  "FacultyRegister",
  FacultyRegisterSchema
);
