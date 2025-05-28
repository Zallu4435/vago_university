import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IProgram extends Document {
  studentId: ObjectId;
  degree: string;
  catalogYear: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProgramSchema = new Schema<IProgram>({
  studentId: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'User', 
    index: true 
  },
  degree: { type: String, required: true, trim: true },
  catalogYear: { type: String, required: true, trim: true },
}, { timestamps: true });

export const ProgramModel = mongoose.model<IProgram>('Program', ProgramSchema);