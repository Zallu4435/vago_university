import mongoose, { Schema } from "mongoose";
import { NotificationRecipientType, NotificationStatus, Notification } from "../../../../domain/notifications/entities/NotificationTypes";

const NotificationSchema = new Schema<Notification>({
  title: { type: String, required: true },
  message: { type: String, required: true },
  recipientType: {
    type: String,
    enum: Object.values(NotificationRecipientType),
    required: true,
  },
  recipientId: { type: String, required: false },
  recipientName: { type: String, required: false },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  status: { type: String, enum: Object.values(NotificationStatus), required: true },
  readBy: { type: [String], default: [] }, // Array of user IDs who have read this notification
});

// Add indexes for better query performance
NotificationSchema.index({ recipientId: 1, createdAt: -1 });
NotificationSchema.index({ recipientType: 1, createdAt: -1 });
NotificationSchema.index({ createdBy: 1, createdAt: -1 });
NotificationSchema.index({ readBy: 1 }); // Index for readBy array

export const NotificationModel = mongoose.model<Notification>(
  "Notification",
  NotificationSchema
);
