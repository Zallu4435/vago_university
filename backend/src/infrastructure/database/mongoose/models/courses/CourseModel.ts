import mongoose, { Schema, Document } from "mongoose";

export interface ICourseDocument extends Document {
  title: string;
  specialization: string;
  faculty: string;
  credits: number;
  schedule: string;
  maxEnrollment: number;
  currentEnrollment: number;
  description?: string;
  term?: string;
  prerequisites?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true, index: true },
    faculty: { type: String, required: true, trim: true, index: true },
    credits: { type: Number, required: true, min: 0 },
    schedule: { type: String, required: true, trim: true },
    maxEnrollment: { type: Number, required: true, min: 1 },
    currentEnrollment: { type: Number, default: 0, min: 0 },
    description: { type: String, trim: true },
    term: { type: String, trim: true },
    prerequisites: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

CourseSchema.index({ title: "text" });

export interface IEnrollmentDocument extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  status: "Pending" | "Approved" | "Rejected";
  requestedAt: Date;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollmentDocument>({
  studentId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  courseId: { type: Schema.Types.ObjectId, required: true, ref: "Course", index: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  requestedAt: { type: Date, default: Date.now },
  reason: { type: String, trim: true },
}, { timestamps: true, toJSON: { virtuals: true } });

EnrollmentSchema.index({ courseId: 1, status: 1 });
EnrollmentSchema.index({ studentId: 1 });

export const CourseModel = mongoose.model<ICourseDocument>("Course", CourseSchema);
export const EnrollmentModel = mongoose.model<IEnrollmentDocument>("Enrollment", EnrollmentSchema);