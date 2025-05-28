import mongoose, { Schema, Document } from 'mongoose';

export interface IMeeting extends Document {
  studentId: string;
  date: string;
  reason: string;
  preferredTime?: string;
  notes?: string;
  meetingId: string;
  meetingTime: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const MeetingSchema = new Schema<IMeeting>({
  studentId: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
  date: { type: String, required: true, trim: true },
  reason: { type: String, required: true, trim: true },
  preferredTime: { type: String, enum: ['morning', 'afternoon'] },
  notes: { type: String, trim: true },
  meetingId: { type: String, required: true, unique: true, trim: true },
  meetingTime: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
}, { timestamps: true });

export const MeetingModel = mongoose.model<IMeeting>('Meeting', MeetingSchema);