import httpClient from '../../../../../frameworks/api/httpClient';
import { Chat, Message, User, PaginatedResponse } from '../types/ChatTypes';

class ChatService {
  async getChats(page = 1, limit = 20): Promise<PaginatedResponse<Chat>> {
    try {
      const response = await httpClient.get(`/chats?page=${page}&limit=${limit}`);
      const chats = response.data.data.data.map((chat: any) => ({
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
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch chats');
    }
  }

  async searchChats(query: string, page = 1, limit = 20): Promise<PaginatedResponse<Chat>> {
    try {
      const response = await httpClient.get(`/chats/search?query=${query}&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to search chats');
    }
  }

  async getChatDetails(chatId: string): Promise<Chat> {
    try {
      const response = await httpClient.get(`/chats/${chatId}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch chat details');
    }
  }

  async createChat(params: { creatorId: string; participantId: string; type: 'direct' | 'group'; name?: string; avatar?: string }): Promise<Chat> {
    try {
      const response = await httpClient.post('/chats', params);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create chat');
    }
  }

  async getMessages(chatId: string, page = 1, limit = 20, before?: string): Promise<PaginatedResponse<Message>> {
    try {
      const response = await httpClient.get(`/chats/${chatId}/messages?page=${page}&limit=${limit}${before ? `&before=${before}` : ''}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch messages');
    }
  }

  async sendMessage(chatId: string, content: string, type: 'text' | 'image' | 'file' | 'audio' | 'video' = 'text'): Promise<Message> {
    try {
      const response = await httpClient.post(`/chats/${chatId}/messages`, { content, type });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to send message');
    }
  }

  async sendFile(chatId: string, formData: FormData): Promise<Message> {
    try {
      const response = await httpClient.post(`/chats/${chatId}/messages`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to send file');
    }
  }

  async editMessage(chatId: string, messageId: string, newContent: string): Promise<Message> {
    try {
      const response = await httpClient.put(`/chats/${chatId}/messages/${messageId}`, {
        content: newContent
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to edit message');
    }
  }

  async deleteMessage(chatId: string, messageId: string, deleteForEveryone: boolean): Promise<void> {
    if (!messageId || messageId === 'false' || typeof messageId !== 'string') {
      throw new Error('Invalid message selected for deletion.');
    }
    try {
      await httpClient.delete(`/chats/${chatId}/messages/${messageId}`, {
        data: { deleteForEveryone }
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete message');
    }
  }

  async replyToMessage(chatId: string, replyToId: string, content: string): Promise<Message> {
    try {
      const response = await httpClient.post(`/chats/${chatId}/messages`, { content, replyToId });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to reply to message');
    }
  }

  async markMessagesAsRead(chatId: string): Promise<void> {
    try {
      await httpClient.put(`/chats/${chatId}/read`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to mark messages as read');
    }
  }

  async addReaction(messageId: string, emoji: string, userId: string): Promise<void> {
    try {
      await httpClient.post(`/chats/messages/${messageId}/reactions`, { userId, emoji });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to add reaction');
    }
  }

  async removeReaction(messageId: string, userId: string): Promise<void> {
    try {
      await httpClient.delete(`/chats/messages/${messageId}/reactions`, { data: { userId } });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to remove reaction');
    }
  }

  async createGroupChat(params: any): Promise<Chat> {
    try {
      const response = await httpClient.post('/chats/group', params);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create group chat');
    }
  }

  async addGroupMember(chatId: string, userId: string, addedBy: string): Promise<Chat> {
    try {
      const response = await httpClient.post(`/chats/group/${chatId}/members`, { userId, addedBy });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to add group member');
    }
  }

  async removeGroupMember(chatId: string, userId: string, removedBy: string): Promise<Chat> {
    try {
      const response = await httpClient.delete(`/chats/group/${chatId}/members/${userId}`, { data: { removedBy } });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to remove group member');
    }
  }

  async updateGroupAdmin(chatId: string, userId: string, isAdmin: boolean, updatedBy: string): Promise<void> {
    try {
      await httpClient.patch(`/chats/group/${chatId}/admins/${userId}`, { isAdmin, updatedBy });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update group admin');
    }
  }

  async updateGroupSettings(chatId: string, settings: {
    onlyAdminsCanPost?: boolean;
    onlyAdminsCanAddMembers?: boolean;
    onlyAdminsCanChangeInfo?: boolean;
  }, updatedBy: string): Promise<void> {
    try {
      await httpClient.patch(`/chats/group/${chatId}/settings`, { settings, updatedBy });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update group settings');
    }
  }

  async updateGroupInfo(chatId: string, info: {
    name?: string;
    description?: string;
    avatar?: string;
  }, updatedBy: string): Promise<void> {
    try {
      await httpClient.patch(`/chats/group/${chatId}`, { ...info, updatedBy });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update group info');
    }
  }

  async leaveGroup(chatId: string, userId: string): Promise<void> {
    try {
      await httpClient.post(`/chats/group/${chatId}/leave`, { userId });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to leave group');
    }
  }

  async searchUsers(query: string, page = 1, limit = 20): Promise<PaginatedResponse<User>> {
    try {
      const response = await httpClient.get(`/chats/users/search?query=${query}&page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to search users');
    }
  }

  async deleteChat(chatId: string): Promise<void> {
    try {
      await httpClient.delete(`/chats/${chatId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete chat');
    }
  }

  async blockChat(chatId: string): Promise<void> {
    try {
      await httpClient.post(`/chats/${chatId}/block`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to block chat');
    }
  }

  async clearChat(chatId: string): Promise<void> {
    try {
      await httpClient.delete(`/chats/${chatId}/messages`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to clear chat');
    }
  }
}

export const chatService = new ChatService(); 