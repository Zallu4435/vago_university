import httpClient from '../../../../../frameworks/api/httpClient';
import { Chat, Message, User, PaginatedResponse } from '../types/ChatTypes';

export const chatService = {
  // Chat operations
  getChats: async (page = 1, limit = 20): Promise<PaginatedResponse<Chat>> => {
    const response = await httpClient.get(`/chats?page=${page}&limit=${limit}`);
    return response.data;
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

  replyToMessage: async (chatId: string, content: string, replyToId: string): Promise<Message> => {
    const response = await httpClient.post(`/chats/${chatId}/messages`, { content, replyToId });
    return response.data;
  },

  markMessagesAsRead: async (chatId: string): Promise<void> => {
    await httpClient.put(`/chats/${chatId}/read`);
  },

  // Reaction operations
  addReaction: async (messageId: string, emoji: string): Promise<void> => {
    await httpClient.post(`/messages/${messageId}/reactions`, { emoji });
  },

  removeReaction: async (messageId: string, emoji: string): Promise<void> => {
    await httpClient.delete(`/messages/${messageId}/reactions/${emoji}`);
  },

  // Group operations
  addGroupMember: async (chatId: string, userId: string): Promise<void> => {
    await httpClient.post(`/chats/${chatId}/members`, { userId });
  },

  removeGroupMember: async (chatId: string, userId: string): Promise<void> => {
    await httpClient.delete(`/chats/${chatId}/members/${userId}`);
  },

  updateGroupSettings: async (chatId: string, settings: { onlyAdminsCanPost?: boolean; onlyAdminsCanAddMembers?: boolean }): Promise<void> => {
    await httpClient.put(`/chats/${chatId}/settings`, settings);
  },

  // User operations
  searchUsers: async (query: string, page = 1, limit = 20): Promise<PaginatedResponse<User>> => {
    const response = await httpClient.get(`/chats/users/search?query=${query}&page=${page}&limit=${limit}`);
    return response.data;
  }
}; 