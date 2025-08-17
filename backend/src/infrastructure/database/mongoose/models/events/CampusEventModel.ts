import mongoose, { Schema, model, models } from "mongoose";
import { 
  OrganizerType, 
  EventType, 
  Timeframe, 
  EventStatus, 
  Event,
  EventRequest,
  EventRequestStatus
} from "../../../../../domain/events/entities/EventTypes";

const campusEventSchema = new Schema<Event>(
  {
    title: { type: String, required: true, minlength: 3 },
    organizer: { type: String, required: true, minlength: 2 },
    organizerType: {
      type: String,
      required: true,
      enum: Object.values(OrganizerType),
    },
    eventType: {
      type: String,
      required: true,
      enum: Object.values(EventType),
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true, minlength: 3 },
    timeframe: {
      type: String,
      required: true,
      enum: Object.values(Timeframe),
    },
    icon: { type: String, default: "📅" },
    color: { type: String, default: "#8B5CF6" },
    description: { type: String, default: "" },
    fullTime: { type: Boolean, default: false },
    additionalInfo: { type: String, default: "" },
    requirements: { type: String, default: "" },
    status: {
      type: String,
      required: true,
      enum: Object.values(EventStatus),
      default: EventStatus.Upcoming,
    },
    maxParticipants: { type: Number, default: 0 },
    registrationRequired: { type: Boolean, default: false },
    participants: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const eventRequestSchema = new Schema<EventRequest>({
  eventId: { type: String, required: true },
  userId: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(EventRequestStatus),
    default: EventRequestStatus.Pending,
    required: true,
  },
  whyJoin: { type: String, required: true, trim: true },
  additionalInfo: { type: String, trim: true, default: "" },
  },
  {
    timestamps: true,
  }
);

eventRequestSchema.index({ eventId: 1 });
eventRequestSchema.index({ userId: 1 });

export const CampusEventModel = mongoose.model<Event>(
  "CampusEvent", 
  campusEventSchema
);
export const EventRequestModel = mongoose.model<EventRequest>(
  "EventRequest", 
  eventRequestSchema
);