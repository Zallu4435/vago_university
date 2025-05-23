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
    prerequisites: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Indexes for performance optimization
CourseSchema.index({ title: "text" });

export const CourseModel = mongoose.model<ICourseDocument>(
  "Course",
  CourseSchema
);
