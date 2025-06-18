import mongoose from 'mongoose';
import { MessageStatus, UserRole } from '../../../domain/communication/entities/Communication';

const recipientSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), required: true },
  status: { type: String, enum: Object.values(MessageStatus), default: MessageStatus.Unread }
});

const attachmentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  contentType: { type: String, required: true },
  size: { type: Number, required: true }
});

const messageSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  content: { type: String, required: true },
  sender: {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), required: true }
  },
  recipients: [recipientSchema],
  isBroadcast: { type: Boolean, default: false },
  attachments: [attachmentSchema]
}, {
  timestamps: true
});

export const MessageModel = mongoose.model('Message', messageSchema); 