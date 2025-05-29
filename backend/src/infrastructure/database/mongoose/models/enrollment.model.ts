import mongoose, { Schema, Document } from 'mongoose';

export interface IEnrollmentDocument extends Document {
  studentId: string;
  courseId: string;
  term: string;
  section: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedAt: Date;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollmentDocument>({
  studentId: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
  courseId: { type: Schema.Types.ObjectId, required: true, ref: 'Course', index: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  requestedAt: { type: Date, default: Date.now },
  reason: { type: String, trim: true },
}, { timestamps: true, toJSON: { virtuals: true } });

EnrollmentSchema.index({ courseId: 1, status: 1 });
EnrollmentSchema.index({ studentId: 1, term: 1 });

export const EnrollmentModel = mongoose.model<IEnrollmentDocument>('Enrollment', EnrollmentSchema);