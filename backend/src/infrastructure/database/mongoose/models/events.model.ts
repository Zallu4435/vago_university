import { Schema, model, models } from 'mongoose';

const campusEventSchema = new Schema({
  name: { type: String, required: true },
  organizer: { type: String, required: true },
  organizerType: { type: String, required: true, enum: ['department', 'club', 'student'] },
  type: { type: String, required: true, enum: ['workshop', 'seminar', 'fest', 'competition', 'exhibition'] },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  status: { type: String, required: true, enum: ['upcoming', 'completed', 'cancelled'] },
  description: { type: String, required: true },
  maxParticipants: { type: Number, required: true },
  registrationRequired: { type: Boolean, required: true },
  participants: { type: Number, default: 0 },
  createdAt: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const eventRequestSchema = new Schema({
  eventName: { type: String, required: true },
  requestedBy: { type: String, required: true },
  requesterType: { type: String, required: true, enum: ['department', 'club', 'student'] },
  type: { type: String, required: true, enum: ['workshop', 'seminar', 'fest', 'competition', 'exhibition'] },
  proposedDate: { type: String, required: true },
  proposedVenue: { type: String, required: true },
  status: { type: String, required: true, enum: ['pending', 'approved', 'rejected'] },
  requestedAt: { type: String, required: true },
  description: { type: String, required: true },
  expectedParticipants: { type: Number, required: true },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const participantSchema = new Schema({
  name: { type: String, required: true },
  studentId: { type: String, required: true },
  registeredAt: { type: String, required: true },
  status: { type: String, required: true, enum: ['pending', 'confirmed', 'rejected'] },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwriting by checking if the model is already defined
export const CampusEventModel = models.CampusEvent || model('CampusEvent', campusEventSchema);
export const EventRequestModel = models.EventRequest || model('EventRequest', eventRequestSchema);
export const ParticipantModel = models.Participant || model('Participant', participantSchema);