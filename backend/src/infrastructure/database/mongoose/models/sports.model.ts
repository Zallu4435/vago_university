import { Schema, model } from 'mongoose';

const teamSchema = new Schema({
  name: { type: String, required: true },
  sportType: { type: String, required: true },
  coach: { type: String, required: true },
  playerCount: { type: Number, required: true },
  status: { type: String, required: true, enum: ['active', 'inactive', 'pending'] },
  formedOn: { type: String, required: true },
  logo: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const eventSchema = new Schema({
  title: { type: String, required: true },
  sportType: { type: String, required: true },
  teams: [{ type: String, required: true }],
  dateTime: { type: String, required: true },
  venue: { type: String, required: true },
  status: { type: String, required: true, enum: ['scheduled', 'completed', 'cancelled'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const teamRequestSchema = new Schema({
  teamName: { type: String, required: true },
  sportType: { type: String, required: true },
  requestedBy: { type: String, required: true },
  reason: { type: String, required: true },
  requestedAt: { type: String, required: true },
  status: { type: String, required: true, enum: ['pending', 'approved', 'rejected'] },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const playerRequestSchema = new Schema({
  studentName: { type: String, required: true },
  studentId: { type: String, required: true },
  team: { type: String, required: true },
  sport: { type: String, required: true },
  reason: { type: String, required: true },
  requestedAt: { type: String, required: true },
  status: { type: String, required: true, enum: ['pending', 'approved', 'rejected'] },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const TeamModel = model('Team', teamSchema);
export const EventModel = model('Event', eventSchema);
export const TeamRequestModel = model('TeamRequest', teamRequestSchema);
export const PlayerRequestModel = model('PlayerRequest', playerRequestSchema);