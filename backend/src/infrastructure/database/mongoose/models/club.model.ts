import { Schema, model } from "mongoose";

// Club Schema
const clubSchema = new Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  members: { type: String, trim: true, default: "" },
  icon: { type: String, trim: true, default: "🎓" },
  color: { type: String, trim: true, default: "#8B5CF6" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  role: { type: String, required: true, trim: true },
  nextMeeting: { type: String, trim: true, default: "" },
  about: { type: String, trim: true, default: "" },
  createdBy: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  upcomingEvents: [
    {
      date: { type: String, trim: true, required: true },
      description: { type: String, trim: true, required: true },
      _id: false,
    },
  ],
});

// ✅ Define indexes after schema creation
clubSchema.index({ name: 1 });
clubSchema.index({ type: 1 });

clubSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});
const clubRequestSchema = new Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  members: { type: String, trim: true, default: "" },
  icon: { type: String, trim: true, default: "🎓" },
  color: { type: String, trim: true, default: "#8B5CF6" },
  role: { type: String, required: true, trim: true },
  nextMeeting: { type: String, trim: true, default: "" },
  about: { type: String, trim: true, default: "" },
  createdBy: { type: String, required: true, trim: true },
  status: {
    type: String,
    required: true,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  rejectionReason: { type: String, trim: true, default: "" },
  createdAt: { type: Date, default: Date.now },
  upcomingEvents: [
    {
      date: { type: String, trim: true, required: true },
      description: { type: String, trim: true, required: true },
      _id: false,
    },
  ],
});

// ✅ Define indexes separately
clubRequestSchema.index({ name: 1 });
clubRequestSchema.index({ status: 1 });

const memberRequestSchema = new Schema({
  clubId: { type: Schema.Types.ObjectId, ref: "Club", required: true },
  userId: { type: String, required: true, trim: true },
  status: {
    type: String,
    required: true,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  rejectionReason: { type: String, trim: true, default: "" },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Define indexes separately
memberRequestSchema.index({ clubId: 1 });
memberRequestSchema.index({ userId: 1 });

export const ClubModel = model("Club", clubSchema);
export const ClubRequestModel = model("ClubRequest", clubRequestSchema);
export const MemberRequestModel = model("MemberRequest", memberRequestSchema);
