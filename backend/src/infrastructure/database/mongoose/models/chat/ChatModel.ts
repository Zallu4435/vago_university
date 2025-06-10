import mongoose, { Schema, Document } from "mongoose";
import { ChatType } from "../../../../../domain/chat/entities/Chat";

export interface IChat extends Document {
  type: ChatType;
  name: string;
  avatar?: string;
  description?: string;
  participants: string[];
  admins: string[];
  createdBy: string;
  lastMessage?: {
    id: string;
    content: string;
    type: string;
    senderId: string;
    status: string;
    createdAt: Date;
  };
  settings: {
    onlyAdminsCanPost: boolean;
    onlyAdminsCanAddMembers: boolean;
    onlyAdminsCanChangeInfo: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    type: { 
      type: String, 
      required: true,
      enum: Object.values(ChatType)
    },
    name: { type: String, required: true },
    avatar: { type: String },
    description: { type: String },
    participants: [{ type: String, required: true }],
    admins: [{ type: String }],
    createdBy: { type: String, required: true },
    lastMessage: {
      id: { type: String },
      content: { type: String },
      type: { type: String },
      senderId: { type: String },
      status: { type: String },
      createdAt: { type: Date }
    },
    settings: {
      onlyAdminsCanPost: { type: Boolean, default: false },
      onlyAdminsCanAddMembers: { type: Boolean, default: false },
      onlyAdminsCanChangeInfo: { type: Boolean, default: false }
    }
  },
  {
    timestamps: true,
    indexes: [
      { participants: 1 }, // For finding user's chats
      { type: 1, participants: 1 }, // For finding direct chats
      { updatedAt: -1 } // For sorting chats by latest activity
    ]
  }
);

export const ChatModel = mongoose.model<IChat>("Chat", chatSchema); 