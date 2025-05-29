import { Schema, model, models } from "mongoose";

const campusEventSchema = new Schema(
  {
    title: { type: String, required: true, minlength: 3 },
    organizer: { type: String, required: true, minlength: 2 },
    organizerType: {
      type: String,
      required: true,
      enum: ["department", "club", "student", "administration", "external"],
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        "workshop",
        "seminar",
        "fest",
        "competition",
        "exhibition",
        "conference",
        "hackathon",
        "cultural",
        "sports",
        "academic",
      ],
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true, minlength: 3 },
    timeframe: {
      type: String,
      required: true,
      enum: ["morning", "afternoon", "evening", "night", "allday"],
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
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },
    maxParticipants: { type: Number, default: 0 },
    registrationRequired: { type: Boolean, default: false },
    participants: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const eventRequestSchema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: "CampusEvent", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    required: true,
  },
  whyJoin: { type: String, required: true, trim: true },
  additionalInfo: { type: String, trim: true, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

eventRequestSchema.index({ clubId: 1 });
eventRequestSchema.index({ userId: 1 });

export const CampusEventModel =
  models.CampusEvent || model("CampusEvent", campusEventSchema);
export const EventRequestModel =
  models.EventRequest || model("EventRequest", eventRequestSchema);
