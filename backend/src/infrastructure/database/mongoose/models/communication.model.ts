import { Schema, model, models } from 'mongoose';

const inboxMessageSchema = new Schema({
  id: { type: String, required: true, unique: true },
  from: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, required: true, enum: ['unread', 'read'] },
  content: { type: String, required: true },
  recipientId: { type: String, required: true },
  thread: [{
    id: { type: String, required: true },
    from: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
  }],
  isArchived: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const sentMessageSchema = new Schema({
  id: { type: String, required: true, unique: true },
  to: { type: String, required: true },
  subject: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, required: true, enum: ['delivered', 'opened'] },
  content: { type: String, required: true },
  recipients: { type: Number, required: true },
  senderId: { type: String, required: true },
  attachments: [{
    public_id: { type: String, required: true },
    secure_url: { type: String, required: true },
    filename: { type: String, required: true },
    format: { type: String, required: true },
    bytes: { type: Number, required: true },
  }],
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwriting
export const InboxMessageModel = models.InboxMessage || model('InboxMessage', inboxMessageSchema);
export const SentMessageModel = models.SentMessage || model('SentMessage', sentMessageSchema);