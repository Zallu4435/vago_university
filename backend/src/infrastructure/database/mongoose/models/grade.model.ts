import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IGrade extends Document {
  studentId: ObjectId;
  cumulativeGPA: string;
  termGPA: string;
  termName: string;
  creditsEarned: string;
  creditsInProgress: string;
  createdAt: Date;  
  updatedAt: Date;
}

const GradeSchema = new Schema<IGrade>({
  studentId: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
  cumulativeGPA: { type: String, required: true, trim: true },
  termGPA: { type: String, required: true, trim: true },
  termName: { type: String, required: true, trim: true },
  creditsEarned: { type: String, required: true, trim: true },
  creditsInProgress: { type: String, required: true, trim: true },
}, { timestamps: true });

export const GradeModel = mongoose.model<IGrade>('Grade', GradeSchema);