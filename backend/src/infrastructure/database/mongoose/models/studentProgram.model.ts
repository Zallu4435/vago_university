import mongoose, { Schema, Document, Types } from 'mongoose';
import { IProgram } from '../../../../domain/student/entities/Program';

export interface IProgramDocument extends Document, Omit<IProgram, '_id' | 'studentId'> {
  studentId: Types.ObjectId;
}

const ProgramSchema = new Schema<IProgramDocument>({
  studentId: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'User', 
    index: true 
  },
  degree: { type: String, required: true, trim: true },
  catalogYear: { type: String, required: true, trim: true },
  credits: { type: Number, default: 20 },
}, { timestamps: true });

export const ProgramModel = mongoose.model<IProgramDocument>('Program', ProgramSchema);
