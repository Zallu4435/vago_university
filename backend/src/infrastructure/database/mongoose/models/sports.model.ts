import { Schema, model } from 'mongoose';

const teamSchema = new Schema({
  title: { type: String, required: true, minlength: 2 },
  type: { type: String, required: true },
  category: { type: String, required: true },
  organizer: { type: String, required: true, minlength: 2 },
  organizerType: {
    type: String,
    required: true,
    enum: ['department', 'club', 'student', 'administration', 'external'],
  },
  icon: { type: String, required: true, default: '⚽' },
  color: { 
    type: String, 
    required: true, 
    default: '#8B5CF6',
    match: [/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code (e.g., #8B5CF6)']
  },
  division: { type: String, required: true },
  headCoach: { type: String, required: true, minlength: 2 },
  homeGames: { type: Number, required: true, min: 0 },
  record: {
    type: String,
    required: true,
    match: [/^\d+-\d+-\d+$/, 'Record must be in format W-L-T (e.g., 5-3-1)'],
  },
  upcomingGames: [{
    date: { type: String, required: true, minlength: 10 },
    description: { type: String, required: true, minlength: 5 },
  }],
  participants: { type: Number, required: true, min: 0, default: 0 },
  status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Ensure upcomingGames has at least one entry
teamSchema.path('upcomingGames').validate(function (value: any[]) {
  return value && value.length > 0;
}, 'At least one upcoming game is required');

// Update updatedAt on save
teamSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const eventSchema = new Schema({
  title: { type: String, required: true },
  sportType: { type: String, required: true },
  teams: [{ type: String, required: true }],
  dateTime: { type: String, required: true },
  venue: { type: String, required: true },
  status: { type: String, required: true, enum: ['upcoming', 'completed', 'cancelled'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update updatedAt on save
eventSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
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
  updatedAt: { type: Date, default: Date.now },
});

// Update updatedAt on save
teamRequestSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
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
  updatedAt: { type: Date, default: Date.now },
});

// Update updatedAt on save
playerRequestSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const TeamModel = model('Team', teamSchema);
export const EventModel = model('Event', eventSchema);
export const TeamRequestModel = model('TeamRequest', teamRequestSchema);
export const PlayerRequestModel = model('PlayerRequest', playerRequestSchema);