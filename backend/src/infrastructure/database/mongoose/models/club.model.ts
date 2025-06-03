// import { Schema, model } from "mongoose";

// const clubSchema = new Schema({
//   name: { type: String, required: true, trim: true },
//   type: { type: String, required: true, trim: true },
//   members: { type: String, trim: true, default: "" },
//   icon: { type: String, trim: true, default: "🎓" },
//   color: { type: String, trim: true, default: "#8B5CF6" },
//   status: { type: String, enum: ["active", "inactive"], default: "active" },
//   role: { type: String, required: true, trim: true },
//   nextMeeting: { type: String, trim: true, default: "" },
//   about: { type: String, trim: true, default: "" },
//   createdBy: { type: String, required: true, trim: true },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
//   enteredMembers: { type: Number, default: 0 },
//   upcomingEvents: [
//     {
//       date: { type: String, trim: true, required: true },
//       description: { type: String, trim: true, required: true },
//       _id: false,
//     },
//   ],
// });

// clubSchema.index({ name: 1 });
// clubSchema.index({ type: 1 });

// clubSchema.pre("save", function (next) {
//   this.updatedAt = new Date();
//   next();
// });

// const clubRequestSchema = new Schema({
//   clubId: { type: Schema.Types.ObjectId, ref: "Club", required: true },
//   userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//   status: {
//     type: String,
//     enum: ["pending", "approved", "rejected"],
//     default: "pending",
//     required: true,
//   },
//   whyJoin: { type: String, required: true, trim: true },
//   additionalInfo: { type: String, trim: true, default: "" },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// clubRequestSchema.index({ clubId: 1 });
// clubRequestSchema.index({ userId: 1 });

// export const ClubModel = model("Club", clubSchema);
// export const ClubRequestModel = model("ClubRequest", clubRequestSchema);
