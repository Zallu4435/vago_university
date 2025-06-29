import mongoose, { Schema, Document } from 'mongoose';

     export interface IProgress extends Document {
       studentId: mongoose.Types.ObjectId;
       overallProgress: number;
       totalCredits: number;
       completedCredits: number;
       remainingCredits: number;
       estimatedGraduation: string;
       createdAt: Date;
       updatedAt: Date;
     }

     const ProgressSchema = new Schema<IProgress>({
       studentId: { 
         type: Schema.Types.ObjectId, 
         required: true, 
         ref: 'User', 
         index: true 
       },
       overallProgress: { type: Number, required: true, default: 0 },
       totalCredits: { type: Number, required: true, default: 0 },
       completedCredits: { type: Number, required: true, default: 0 },
       remainingCredits: { type: Number, required: true, default: 0 },
       estimatedGraduation: { type: String, required: true, trim: true, default: '' },
     }, { timestamps: true });

     ProgressSchema.index({ studentId: 1 });

     export const ProgressModel = mongoose.model<IProgress>('Progress', ProgressSchema);