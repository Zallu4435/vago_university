import mongoose, { Schema, Document } from 'mongoose';

export interface IAcademicHistory extends Document {
  studentId: mongoose.Types.ObjectId;
  term: string;
  credits: string;
  gpa: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

const AcademicHistorySchema = new Schema<IAcademicHistory>({
  studentId: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
  term: { type: String, required: true, trim: true },
  credits: { type: String, required: true, trim: true },
  gpa: { type: String, required: true, trim: true },
  id: { type: Number, required: true, unique: true },
}, { timestamps: true });

export const AcademicHistoryModel = mongoose.model<IAcademicHistory>('AcademicHistory', AcademicHistorySchema);