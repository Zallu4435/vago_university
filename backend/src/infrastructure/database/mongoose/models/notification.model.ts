import mongoose, { Schema } from "mongoose";

interface Notification {
  _id: string;
  title: string;
  message: string;
  recipientType: "individual" | "all_students" | "all_faculty" | "all";
  recipientId?: string;
  recipientName?: string;
  createdBy: string;
  createdAt: string;
  status: "sent" | "failed";
}

const NotificationSchema = new Schema<Notification>({
  title: { type: String, required: true },
  message: { type: String, required: true },
  recipientType: {
    type: String,
    enum: ['individual', 'all_students', 'all_faculty', 'all', 'all_students_and_faculty'],
    required: true,
  },
  recipientId: { type: String, required: false },
  recipientName: { type: String, required: false },
  createdBy: { type: String, required: true },
  createdAt: { type: String, required: true },
  status: { type: String, enum: ["sent", "failed"], required: true },
});

export const NotificationModel = mongoose.model<Notification>(
  "Notification",
  NotificationSchema
);
