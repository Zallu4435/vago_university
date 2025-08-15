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
  createdAt: string;
  updatedAt: string;
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
  messages: MessageSummaryDTO[];
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

export interface GetUserGroupsResponseDTO {
  groups: Array<{
    value: string;
    label: string;
  }>;
}

export interface FetchUsersResponseDTO {
  users: UserInfo[];
} 