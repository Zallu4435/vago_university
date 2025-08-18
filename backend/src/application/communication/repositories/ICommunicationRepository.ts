import { Message, UserInfo } from "../../../domain/communication/entities/Communication";
import { IMessage } from "../../../infrastructure/database/mongoose/models/communication.model";

export interface ICommunicationRepository {
  getInboxMessages(userId: string, page: number, limit: number, search?: string, status?: string): Promise<{
    messages: IMessage[];
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
    userId: string;
    status?: string;
    search?: string;
  }>;
  getSentMessages(userId: string, page: number, limit: number, search?: string, status?: string): Promise<{
    messages: IMessage[];
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
    userId: string;
    status?: string;
    search?: string;
  }>;
  sendMessage(senderId: string, senderRole: string, to: Array<{ value: string; label: string }>, subject: string, content: string, attachments?: Array<{
    filename: string;
    path: string;
    contentType: string;
    size: number;
  }>): Promise<IMessage>;
  sendUserMessage(senderId: string, senderRole: string, to: Array<{ value: string; label: string }>, subject: string, content: string, attachments?: Array<{
    filename: string;
    path: string;
    contentType: string;
    size: number;
  }>): Promise<IMessage>;
  deleteMessage(messageId: string, userId: string): Promise<void>;
  getMessageDetails(messageId: string): Promise<IMessage | null>;
  markMessageAsRead(messageId: string, userId: string): Promise<void>;
  getAllAdmins(search?: string): Promise<UserInfo[]>;
  fetchUsers(type: string, search?: string): Promise<UserInfo[]>;

  // Helper methods
  findUserById(userId: string, role: string): Promise<UserInfo | null>;
  findMessageById(messageId: string): Promise<Message | null>;
  createMessage(message: Message): Promise<void>;
  updateMessageRecipientStatus(messageId: string, userId: string, status: string): Promise<void>;
  findAdmins(search?: string): Promise<UserInfo[]>;
  findUsersByType(type: string, search?: string, requesterId?: string): Promise<UserInfo[]>;
} 