import mongoose, { Schema, model } from "mongoose";
import { 
  Sport, 
  SportRequest, 
  SportStatus, 
  SportRequestStatus 
} from "../../../../domain/sports/entities/SportTypes";

const teamSchema = new Schema<Sport>({
  title: { type: String, required: true, minlength: 2 },
  type: { type: String, required: true },
  category: { type: String, required: true },
  organizer: { type: String, required: true, minlength: 2 },
  organizerType: {
    type: String,
    required: true,
    enum: ["department", "club", "student", "administration", "external"],
  },
  icon: { type: String, required: true, default: "⚽" },
  color: {
    type: String,
    required: true,
    default: "#8B5CF6",
    match: [
      /^#[0-9A-Fa-f]{6}$/,
      "Color must be a valid hex code (e.g., #8B5CF6)",
    ],
  },
  division: { type: String, required: true },
  headCoach: { type: String, required: true, minlength: 2 },
  homeGames: { type: Number, required: true, min: 0 },
  record: {
    type: String,
    required: true,
    match: [/^\d+-\d+-\d+$/, "Record must be in format W-L-T (e.g., 5-3-1)"],
  },
  upcomingGames: [
    {
      date: { type: String, required: true, minlength: 10 },
      description: { type: String, required: true, minlength: 5 },
    },
  ],
  participants: { type: Number, required: true, min: 0, default: 0 },
  status: {
    type: String,
    required: true,
    enum: Object.values(SportStatus),
    default: SportStatus.Active,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

teamSchema.path("upcomingGames").validate(function (value: any[]) {
  return value && value.length > 0;
}, "At least one upcoming game is required");

teamSchema.pre("save", function (next) {
  (this as any).updatedAt = new Date();
  next();
});

const sportRequestSchema = new Schema<SportRequest>({
  sportId: { type: Schema.Types.ObjectId, ref: "Team", required: true } as any,
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true } as any,
  status: {
    type: String,
    enum: Object.values(SportRequestStatus),
    default: SportRequestStatus.Pending,
    required: true,
  },
  whyJoin: { type: String, required: true, trim: true },
  additionalInfo: { type: String, trim: true, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

sportRequestSchema.index({ clubId: 1 });
sportRequestSchema.index({ userId: 1 });

export const TeamModel = mongoose.model<Sport>(
  "Team", 
  teamSchema
);
export const SportRequestModel = mongoose.model<SportRequest>(
  "SportRequest", 
  sportRequestSchema
);
