import mongoose, { Schema, Document, Types } from 'mongoose';

export type IProgramDocument = Document & {
  studentId: Types.ObjectId;
  degree: string;
  catalogYear: string;
  credits: number;
};

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
