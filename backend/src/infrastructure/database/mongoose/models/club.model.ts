import { Schema, model } from 'mongoose';

const clubSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  createdBy: { type: String, required: true },
  status: { type: String, required: true, enum: ['active', 'inactive', 'pending'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const clubRequestSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  createdBy: { type: String, required: true },
  status: { type: String, required: true, enum: ['pending', 'approved', 'rejected'] },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const memberRequestSchema = new Schema({
  clubId: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
  userId: { type: String, required: true },
  status: { type: String, required: true, enum: ['pending', 'approved', 'rejected'] },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const ClubModel = model('Club', clubSchema);
export const ClubRequestModel = model('ClubRequest', clubRequestSchema);
export const MemberRequestModel = model('MemberRequest', memberRequestSchema);