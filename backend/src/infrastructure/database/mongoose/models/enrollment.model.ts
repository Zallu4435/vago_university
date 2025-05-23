import mongoose, { Schema, Document } from 'mongoose';

export interface IEnrollmentDocument extends Document {
  studentId: string;
  courseId: string;
  term: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedAt: Date;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema({
  studentId: { type: String, required: true, trim: true, index: true },
  courseId: { 
    type: String, 
    required: true, 
    ref: 'Course', 
    index: true 
  },
  term: { type: String, required: true, trim: true, index: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  requestedAt: { type: Date, default: Date.now },
  reason: { type: String, trim: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
});

// Indexes for performance optimization
EnrollmentSchema.index({ courseId: 1, status: 1 });

export const EnrollmentModel = mongoose.model<IEnrollmentDocument>('Enrollment', EnrollmentSchema);