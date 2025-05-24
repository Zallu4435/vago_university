import { Schema, model, models } from 'mongoose';

// Campus Event Schema
const campusEventSchema = new Schema({
  title: { type: String, required: true, minlength: 3 },
  organizer: { type: String, required: true, minlength: 2 },
  organizerType: { 
    type: String, 
    required: true, 
    enum: ['department', 'club', 'student', 'administration', 'external'] 
  },
  eventType: { 
    type: String, 
    required: true, 
    enum: ['workshop', 'seminar', 'fest', 'competition', 'exhibition', 'conference', 'hackathon', 'cultural', 'sports', 'academic'] 
  },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true, minlength: 3 },
  timeframe: { 
    type: String, 
    required: true, 
    enum: ['morning', 'afternoon', 'evening', 'night', 'allday'] 
  },
  icon: { type: String, default: '📅' },
  color: { type: String, default: '#8B5CF6' },
  description: { type: String, default: '' },
  fullTime: { type: Boolean, default: false },
  additionalInfo: { type: String, default: '' },
  requirements: { type: String, default: '' },
  status: { 
    type: String, 
    required: true, 
    enum: ['upcoming', 'completed', 'cancelled'], 
    default: 'upcoming' 
  },
  maxParticipants: { type: Number, default: 0 },
  registrationRequired: { type: Boolean, default: false },
  participants: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Event Request Schema
const eventRequestSchema = new Schema({
  eventTitle: { type: String, required: true, minlength: 3 },
  requestedBy: { type: String, required: true, minlength: 2 },
  requesterType: { 
    type: String, 
    required: true, 
    enum: ['department', 'club', 'student', 'administration', 'external'] 
  },
  type: { 
    type: String, 
    required: true, 
    enum: ['workshop', 'seminar', 'fest', 'competition', 'exhibition', 'conference', 'hackathon', 'cultural', 'sports', 'academic'] 
  },
  proposedDate: { type: String, required: true },
  proposedTime: { type: String, required: true },
  proposedLocation: { type: String, required: true, minlength: 3 },
  proposedTimeframe: { 
    type: String, 
    required: true, 
    enum: ['morning', 'afternoon', 'evening', 'night', 'allday'] 
  },
  icon: { type: String, default: '📅' },
  color: { type: String, default: '#8B5CF6' },
  description: { type: String, required: true },
  fullTime: { type: Boolean, default: false },
  additionalInfo: { type: String, default: '' },
  requirements: { type: String, default: '' },
  expectedParticipants: { type: Number, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  rejectionReason: { type: String },
  approvedBy: { type: String },
  approvedAt: { type: Date },
  rejectedAt: { type: Date },
  requestedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Participant Schema
const participantSchema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: 'CampusEvent', required: true },
  name: { type: String, required: true, minlength: 2 },
  studentId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phone: { type: String },
  department: { type: String },
  year: { type: String },
  registeredAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'confirmed', 'rejected', 'waitlisted', 'attended'], 
    default: 'pending' 
  },
  rejectionReason: { type: String },
  specialRequirements: { type: String },
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    relation: { type: String }
  },
  checkedIn: { type: Boolean, default: false },
  checkedInAt: { type: Date },
  checkedOut: { type: Boolean, default: false },
  checkedOutAt: { type: Date },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    submittedAt: { type: Date }
  }
}, {
  timestamps: true
});

participantSchema.index({ eventId: 1, studentId: 1 });
participantSchema.index({ status: 1 });
participantSchema.index({ registeredAt: 1 });

// Model Exports (Only the 3 requested)
export const CampusEventModel = models.CampusEvent || model('CampusEvent', campusEventSchema);
export const EventRequestModel = models.EventRequest || model('EventRequest', eventRequestSchema);
export const ParticipantModel = models.Participant || model('Participant', participantSchema);
