// src/application/services/communication.service.ts

import { Message, MessageForm } from '../../domain/types/communication';
import httpClient from '../../frameworks/api/httpClient';

export class CommunicationService {
  private static instance: CommunicationService;
  private readonly baseUrl = '/admin/communication';

  private constructor() {}

  public static getInstance(): CommunicationService {
    if (!CommunicationService.instance) {
      CommunicationService.instance = new CommunicationService();
    }
    return CommunicationService.instance;
  }

  // Get inbox messages with pagination and filters
  async getInboxMessages(params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    from?: string;
  }): Promise<{ data: Message[]; total: number }> {
    try {
      const response = await httpClient.get(`${this.baseUrl}/inbox`, { params });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch inbox messages');
    }
  }

  // Get sent messages with pagination and filters
  async getSentMessages(params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    to?: string;
  }): Promise<{ data: Message[]; total: number }> {
    try {
      const response = await httpClient.get(`${this.baseUrl}/sent`, { params });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch sent messages');
    }
  }

  // Send a new message
  async sendMessage(form: MessageForm): Promise<Message> {
    try {
      const response = await httpClient.post(`${this.baseUrl}/send`, form);
      return response.data;
    } catch (error) {
      throw new Error('Failed to send message');
    }
  }

  // Reply to a message
  async replyToMessage(messageId: string, form: MessageForm): Promise<Message> {
    try {
      const response = await httpClient.post(`${this.baseUrl}/reply/${messageId}`, form);
      return response.data;
    } catch (error) {
      throw new Error('Failed to reply to message');
    }
  }

  // Delete a message
  async deleteMessage(messageId: string, type: 'inbox' | 'sent'): Promise<void> {
    try {
      await httpClient.delete(`${this.baseUrl}/messages/${messageId}?type=${type}`);
    } catch (error) {
      throw new Error('Failed to delete message');
    }
  }  

  // Archive a message
  async archiveMessage(messageId: string): Promise<void> {
    try {
      await httpClient.post(`${this.baseUrl}/archive/${messageId}`);
    } catch (error) {
      throw new Error('Failed to archive message');
    }
  }

  // Mark message as read
  async markAsRead(messageId: string): Promise<void> {
    try {
      await httpClient.post(`${this.baseUrl}/read/${messageId}`);
    } catch (error) {
      throw new Error('Failed to mark message as read');
    }
  }
}

export const communicationService = CommunicationService.getInstance();