import { MessageType } from "../../../domain/chat/entities/Message";
import { RepositoryChat, RepositoryMessage, RepositoryUser, SearchUsersRepoResponse, CreatedChatSummary, GetChatsRepoResult, SearchChatsRepoResult, GetChatMessagesRepoResult } from "../../../domain/chat/entities/MessageType";

export interface IChatRepository {
  getChats(params: { userId: string; page: number; limit: number }): Promise<GetChatsRepoResult>;
  searchChats(params: { userId: string; query: string; page: number; limit: number }): Promise<SearchChatsRepoResult>;
  getChatMessages(params: { chatId: string; userId: string; page: number; limit: number; before?: string }): Promise<GetChatMessagesRepoResult>;
  sendMessage(params: { chatId: string; senderId: string; content: string; type: MessageType; attachments?: Array<{ type: string; url: string; name?: string; size?: number; mimetype?: string }> }): Promise<void>;
  markMessagesAsRead(params: { chatId: string; userId: string }): Promise<void>;
  addReaction(params: { messageId: string; userId: string; emoji: string }): Promise<void>;
  removeReaction(params: { messageId: string; userId: string }): Promise<void>;
  getChatDetails(chatId: string, userId: string): Promise<{
    chat: RepositoryChat;
    messages: RepositoryMessage[];
    participants: RepositoryUser[];
    unreadCount: number;
  } | null>;
  searchUsers(params: { userId: string; query: string; page: number; limit: number }): Promise<SearchUsersRepoResponse>;
  createChat(params: { creatorId: string; participantId: string; type: string; name?: string; avatar?: string }): Promise<CreatedChatSummary>;
  createGroupChat(params: { name: string; description?: string; participants: string[]; creatorId: string; settings?: Record<string, unknown>; avatar?: string }): Promise<CreatedChatSummary>;
  addGroupMember(params: { chatId: string; userId: string; addedBy: string }): Promise<void>;
  removeGroupMember(params: { chatId: string; userId: string; removedBy: string }): Promise<void>;
  updateGroupAdmin(params: { chatId: string; userId: string; isAdmin: boolean; updatedBy: string }): Promise<void>;
  updateGroupSettings(params: { chatId: string; settings: Record<string, unknown>; updatedBy: string }): Promise<void>;
  updateGroupInfo(params: { chatId: string; name?: string; description?: string; avatar?: string; updatedBy: string }): Promise<void>;
  leaveGroup(params: { chatId: string; userId: string }): Promise<void>;
  editMessage(params: { chatId: string; messageId: string; content: string; userId: string }): Promise<void>;
  deleteMessage(params: { messageId: string; userId: string; deleteForEveryone?: boolean }): Promise<void>;
  replyToMessage(params: { chatId: string; messageId: string; content: string; userId: string }): Promise<void>;
  deleteChat(params: { chatId: string; userId: string }): Promise<void>;
  blockChat(params: { chatId: string; userId: string }): Promise<void>;
  clearChat(params: { chatId: string; userId: string }): Promise<void>;

  // Helper methods for use case mapping without DB in use case
  getUnreadCountForChat(params: { chatId: string; userId: string }): Promise<number>;
  getLastMessageForChat(params: { chatId: string; userId: string }): Promise<{
    id: string;
    content: string;
    type: string;
    senderId: string;
    status: string;
    attachments?: Array<{ type: string; url: string; name?: string; size?: number; mimetype?: string }>;
    createdAt: Date;
  } | null>;
  getUsersByIds(ids: string[]): Promise<Array<{ id: string; firstName: string; lastName: string; email: string; avatar?: string }>>;
} 