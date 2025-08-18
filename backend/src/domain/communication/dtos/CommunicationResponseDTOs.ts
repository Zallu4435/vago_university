import { Message, UserInfo } from "../entities/Communication";

export interface MessageSummaryDTO {
  _id: string;
  subject: string;
  content: string;
  sender: UserInfo;
  recipients: UserInfo[];
  isBroadcast: boolean;
  attachments?: Array<{
    filename: string;
    path: string;
    contentType: string;
    size: number;
  }>;
  createdAt: string | Date;
  updatedAt: string | Date;
  status?: string;
  to?: string;
  recipientsCount?: number;
}

export interface GetInboxMessagesResponseDTO {
  messages: MessageSummaryDTO[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetSentMessagesResponseDTO {
  messages: AdminSentMessageResponseDTO[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SendMessageResponseDTO {
  _id: string;
  subject: string;
  content: string;
  sender: UserInfo;
  recipients: UserInfo[];
  recipientCount: number;
  isBroadcast: boolean;
  attachments?: Array<{
    filename: string;
    path: string;
    contentType: string;
    size: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface MarkMessageAsReadResponseDTO {
  success: boolean;
  message: string;
}

export interface DeleteMessageResponseDTO {
  success: boolean;
  message: string;
}

export interface GetMessageDetailsResponseDTO {
  _id: string;
  subject: string;
  content: string;
  sender: UserInfo;
  recipients: UserInfo[];
  recipientCount: number;
  isBroadcast: boolean;
  attachments?: Array<{
    filename: string;
    path: string;
    contentType: string;
    size: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSentMessageResponseDTO {
  _id: string;
  subject: string;
  content: string;
  recipients: string; // String for admin sent messages (e.g., "All Students", "Multiple Students", "email@example.com")
  recipientCount: number;
  isBroadcast: boolean;
  attachments?: Array<{
    filename: string;
    path: string;
    contentType: string;
    size: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllAdminsResponseDTO {
  admins: UserInfo[];
}



export interface FetchUsersResponseDTO {
  users: Array<{
    id: string;
    email: string;
    name: string;
  }>;
} 