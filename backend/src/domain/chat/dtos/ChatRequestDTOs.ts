export interface GetChatsRequestDTO {
  userId: string;
  page: number;
  limit: number;
}

export interface SearchChatsRequestDTO {
  userId: string;
  query: string;
  page: number;
  limit: number;
}

export interface GetChatMessagesRequestDTO {
  chatId: string;
  userId: string;
  page: number;
  limit: number;
  before?: string;
}

export interface SendMessageRequestDTO {
  chatId: string;
  senderId: string;
  content: string;
  type: string;
  replyTo?: {
    messageId: string;
    content: string;
    senderId: string;
  };
  attachments?: {
    type: string;
    url: string;
    name: string;
    size: number;
    thumbnail?: string;
    duration?: number;
  }[];
}

export interface MarkMessagesAsReadRequestDTO {
  chatId: string;
  userId: string;
}

export interface AddReactionRequestDTO {
  messageId: string;
  userId: string;
  emoji: string;
}

export interface RemoveReactionRequestDTO {
  messageId: string;
  userId: string;
}

export interface SearchUsersRequestDTO {
  userId: string;
  query: string;
  page: number;
  limit: number;
}

export interface CreateChatRequestDTO {
  creatorId: string;
  participantId: string;
  type: 'direct' | 'group';
  name?: string;
  avatar?: string;
}

export interface DeleteMessageRequestDTO {
  messageId: string;
  userId: string;
  deleteForEveryone: boolean;
}

export interface ForwardMessageRequestDTO {
  messageId: string;
  targetChatId: string;
  forwardedBy: string;
}

export interface ReplyToMessageRequestDTO {
  messageId: string;
  replyContent: string;
  repliedBy: string;
}

export interface AddGroupMemberRequestDTO {
  chatId: string;
  userId: string;
  addedBy: string;
}

export interface RemoveGroupMemberRequestDTO {
  chatId: string;
  userId: string;
  removedBy: string;
}

export interface UpdateGroupSettingsRequestDTO {
  chatId: string;
  updatedBy: string;
  settings: {
    onlyAdminsCanPost?: boolean;
    onlyAdminsCanAddMembers?: boolean;
    onlyAdminsCanChangeInfo?: boolean;
  };
} 