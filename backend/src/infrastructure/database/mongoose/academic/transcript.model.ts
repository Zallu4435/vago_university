import mongoose, { Schema, Document } from 'mongoose';

export interface ITranscriptRequest extends Document {
  studentId: mongoose.Types.ObjectId;
  userId?: string;
  deliveryMethod: string;
  address?: string;
  email?: string;
  requestId: string;
  requestedAt?: string;
  estimatedDelivery: string;
  createdAt: Date;
  updatedAt: Date;
}

const TranscriptRequestSchema = new Schema<ITranscriptRequest>({
  studentId: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
  deliveryMethod: { type: String, enum: ['electronic', 'mail'], required: true },
  address: { type: String, trim: true },
  email: { type: String, trim: true },
  requestId: { type: String, required: true, unique: true, trim: true },
  estimatedDelivery: { type: String, required: true, trim: true },
}, { timestamps: true });

export const TranscriptRequestModel = mongoose.model<ITranscriptRequest>('TranscriptRequest', TranscriptRequestSchema);


