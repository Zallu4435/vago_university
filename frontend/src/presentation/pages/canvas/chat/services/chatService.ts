import httpClient from '../../../../../frameworks/api/httpClient';
import { Chat, Message, User, PaginatedResponse } from '../types/ChatTypes';

export const chatService = {
  // Chat operations
  getChats: async (page = 1, limit = 20): Promise<PaginatedResponse<Chat>> => {
    const response = await httpClient.get(`/chats?page=${page}&limit=${limit}`);
    const chats = response.data.data.map((chat: any) => ({
      ...chat,
      participants: chat.participants.map((participant: any) => ({
        id: participant.id,
        firstName: participant.firstName,
        lastName: participant.lastName,
        email: participant.email,
        avatar: participant.avatar,
        isOnline: false
      }))
    }));
    return {
      ...response.data,
      data: chats
    };
  },

  searchChats: async (query: string, page = 1, limit = 20): Promise<PaginatedResponse<Chat>> => {
    const response = await httpClient.get(`/chats/search?query=${query}&page=${page}&limit=${limit}`);
    return response.data;
  },

  getChatDetails: async (chatId: string): Promise<Chat> => {
    const response = await httpClient.get(`/chats/${chatId}`);
    return response.data;
  },

  createChat: async (params: { creatorId: string; participantId: string; type: 'direct' | 'group'; name?: string; avatar?: string }): Promise<Chat> => {
    const response = await httpClient.post('/chats', params);
    return response.data;
  },

  // Message operations
  getMessages: async (chatId: string, page = 1, limit = 20, before?: string): Promise<PaginatedResponse<Message>> => {
    const response = await httpClient.get(`/chats/${chatId}/messages?page=${page}&limit=${limit}${before ? `&before=${before}` : ''}`);
    return response.data;
  },

  sendMessage: async (chatId: string, content: string, type: 'text' | 'image' | 'file' | 'audio' | 'video' = 'text'): Promise<Message> => {
    const response = await httpClient.post(`/chats/${chatId}/messages`, { content, type });
    return response.data;
  },

  sendFile: async (chatId: string, formData: FormData): Promise<Message> => {
    const response = await httpClient.post(`/chats/${chatId}/messages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteMessage: async (messageId: string, deleteForMeOnly = false): Promise<void> => {
    const endpoint = deleteForMeOnly ? `/messages/${messageId}/me` : `/messages/${messageId}`;
    await httpClient.delete(endpoint);
  },

  forwardMessage: async (messageId: string, targetChatId: string): Promise<Message> => {
    const response = await httpClient.post(`/messages/${messageId}/forward`, { targetChatId });
    return response.data;
  },

  replyToMessage: async (chatId: string, replyToId: string, content: string): Promise<Message> => {
    const response = await httpClient.post(`/chats/${chatId}/messages`, { content, replyToId });
    return response.data;
  },

  markMessagesAsRead: async (chatId: string): Promise<void> => {
    await httpClient.put(`/chats/${chatId}/read`);
  },

  // Reaction operations
  addReaction: async (messageId: string, emoji: string, userId: string): Promise<void> => {
    await httpClient.post(`/chats/messages/${messageId}/reactions`, { userId, emoji });
  },

  removeReaction: async (messageId: string, userId: string): Promise<void> => {
    await httpClient.delete(`/chats/messages/${messageId}/reactions`, { data: { userId } });
  },

  // Group operations
  createGroupChat: async (params: {
    name: string;
    description?: string;
    participants: string[];
    creatorId: string;
    settings?: {
      onlyAdminsCanPost?: boolean;
      onlyAdminsCanAddMembers?: boolean;
      onlyAdminsCanChangeInfo?: boolean;
    };
  }): Promise<Chat> => {
    const response = await httpClient.post('/chats/group', params);
    return response.data;
  },

  addGroupMember: async (chatId: string, userId: string, addedBy: string): Promise<void> => {
    await httpClient.post(`/chats/group/${chatId}/members`, { userId, addedBy });
  },

  removeGroupMember: async (chatId: string, userId: string, removedBy: string): Promise<void> => {
    await httpClient.delete(`/chats/group/${chatId}/members/${userId}`, { data: { removedBy } });
  },

  updateGroupAdmin: async (chatId: string, userId: string, isAdmin: boolean, updatedBy: string): Promise<void> => {
    await httpClient.patch(`/chats/group/${chatId}/admins/${userId}`, { isAdmin, updatedBy });
  },

  updateGroupSettings: async (chatId: string, settings: {
    onlyAdminsCanPost?: boolean;
    onlyAdminsCanAddMembers?: boolean;
    onlyAdminsCanChangeInfo?: boolean;
  }, updatedBy: string): Promise<void> => {
    await httpClient.patch(`/chats/group/${chatId}/settings`, { settings, updatedBy });
  },

  updateGroupInfo: async (chatId: string, info: {
    name?: string;
    description?: string;
    avatar?: string;
  }, updatedBy: string): Promise<void> => {
    await httpClient.patch(`/chats/group/${chatId}`, { ...info, updatedBy });
  },

  leaveGroup: async (chatId: string, userId: string): Promise<void> => {
    await httpClient.post(`/chats/group/${chatId}/leave`, { userId });
  },

  // User operations
  searchUsers: async (query: string, page = 1, limit = 20): Promise<PaginatedResponse<User>> => {
    const response = await httpClient.get(`/chats/users/search?query=${query}&page=${page}&limit=${limit}`);
    return response.data;
  },

  editMessage: async (chatId: string, messageId: string, newContent: string): Promise<Message> => {
    const response = await httpClient.put(`/chats/${chatId}/messages/${messageId}`, {
      content: newContent
    });
    return response.data;
  },

  deleteMessage: async (chatId: string, messageId: string, deleteForEveryone: boolean): Promise<void> => {
    await httpClient.delete(`/chats/${chatId}/messages/${messageId}`, {
      data: { deleteForEveryone }
    });
  }
}; 