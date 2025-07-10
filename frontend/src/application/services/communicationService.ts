import { Message, MessageForm, User } from '../../domain/types/user/communication';
import httpClient from '../../frameworks/api/httpClient';
type RecipientType = '' | 'all_students' | 'all_faculty' | 'all_users' | 'individual_students' | 'individual_faculty';

export class CommunicationService {
  private static instance: CommunicationService;
  private readonly userBaseUrl = '/communication';
  private readonly adminBaseUrl = '/communication/admin';

  private constructor() { }

  public static getInstance(): CommunicationService {
    if (!CommunicationService.instance) {
      CommunicationService.instance = new CommunicationService();
    }
    return CommunicationService.instance;
  }

  private getBaseUrl(isAdmin: boolean): string {
    return isAdmin ? this.adminBaseUrl : this.userBaseUrl;
  }

  async getInboxMessages(params: {
    page: number;
    limit: number;
    search?: string;
    status?: 'read' | 'unread';
    from?: string;
    isAdmin?: boolean;
  }): Promise<{ messages: Message[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
    try {
      const baseUrl = this.getBaseUrl(!!params.isAdmin);
      const response = await httpClient.get(`${baseUrl}/inbox`, { params });
      return response.data.data;
    } catch (error) {
      throw new Error('Failed to fetch inbox messages');
    }
  }

  async getSentMessages(params: {
    page: number;
    limit: number;
    search?: string;
    status?: 'read' | 'unread' | 'delivered' | 'opened';
    to?: string;
    isAdmin?: boolean;
  }): Promise<{ messages: Message[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
    try {
      const baseUrl = this.getBaseUrl(!!params.isAdmin);
      const response = await httpClient.get(`${baseUrl}/sent`, { params });
      return response.data.data;
    } catch (error) {
      throw new Error('Failed to fetch sent messages');
    }
  }

  async fetchUsers(type: RecipientType, search?: string): Promise<User[]> {
    if (!type) {
      return [];
    }
    console.log('=== CommunicationService - fetchUsers DEBUG ===');
    console.log('Type received:', type);
    console.log('Type typeof:', typeof type);
    console.log('Search:', search);
    console.log('==============================================');

    const response = await httpClient.get(`/communication/admin/users`, {
      params: {
        type,
        search,
      },
    });
    console.log('CommunicationService - fetchUsers response:', response.data);
    return response.data.data;
  }

  async sendMessage(form: MessageForm): Promise<Message> {
    console.log('CommunicationService - sendMessage called with form:', form);

    const formData = new FormData();
    formData.append('to', JSON.stringify(form.to));
    formData.append('subject', form.subject);
    formData.append('message', form.message);

    console.log('CommunicationService - Attachments to process:', form.attachments);
    form.attachments.forEach((file, index) => {
      console.log(`CommunicationService - Appending attachment ${index}:`, {
        name: file.name,
        type: file.type,
        size: file.size
      });
      formData.append('attachments', file);
    });

    const endpoint = form.isAdmin ? '/communication/admin/messages' : '/communication/admin/messages';
    console.log('CommunicationService - Sending to endpoint:', endpoint);

    const response = await httpClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('CommunicationService - Response received:', response.data);
    return response.data;
  }

  async deleteMessage(messageId: string, isAdmin: boolean = false): Promise<void> {
    try {
      const baseUrl = this.getBaseUrl(isAdmin);
      await httpClient.delete(`${baseUrl}/messages/${messageId}`);
    } catch (error) {
      throw new Error('Failed to delete message');
    }
  }

  async markAsRead(messageId: string, isAdmin: boolean = false): Promise<void> {
    try {
      console.log('=== CommunicationService markAsRead DEBUG ===');
      console.log('MessageId:', messageId);
      console.log('IsAdmin:', isAdmin);

      const baseUrl = this.getBaseUrl(isAdmin);
      const endpoint = `${baseUrl}/messages/${messageId}/read`;
      console.log('Calling endpoint:', endpoint);

      await httpClient.put(endpoint);
      console.log('Mark as read API call successful');
      console.log('================================');
    } catch (error) {
      console.error('Mark as read API call failed:', error);
      throw new Error('Failed to mark message as read');
    }
  }

  async getAllAdmins(): Promise<Admin[]> {
    try {
      const response = await httpClient.get(`${this.userBaseUrl}/all-admins`);
      return response.data.data;
    } catch (error) {
      throw new Error('Failed to fetch admins');
    }
  }

  async getUserGroups(): Promise<Array<{ value: string; label: string }>> {
    try {
      const response = await httpClient.get(`${this.userBaseUrl}/user-groups`);
      return response.data.data;
    } catch (error) {
      throw new Error('Failed to fetch user groups');
    }
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    await httpClient.patch(`/messages/${messageId}/read`);
  }
}

export const communicationService = CommunicationService.getInstance();