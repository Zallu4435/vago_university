import httpClient from '../../frameworks/api/httpClient';
import { Notification, NotificationApiResponse } from '../../domain/types/notification.types';

class NotificationService {
  async getNotifications(
    isAdmin: boolean,
    page: number = 1,
    limit: number = 10,
    recipientType?: string,
    status?: string,
    dateRange?: string
  ): Promise<NotificationApiResponse> {
    try {
      const endpoint = '/admin/notifications';
      const response = await httpClient.get<NotificationApiResponse>(endpoint, {
        params: { page, limit, recipientType, status, dateRange },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch notifications');
    }
  }

  async getNotificationDetails(id: string): Promise<Notification> {
    try {
      const response = await httpClient.get<Notification>(`/admin/notifications/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch notification details');
    }
  }

  async createNotification(data: Omit<Notification, '_id' | 'createdAt' | 'status'>): Promise<Notification> {
    try {
      const response = await httpClient.post<Notification>('/admin/notifications', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to send notification');
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      await httpClient.delete(`/admin/notifications/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete notification');
    }
  }
}

export const notificationService = new NotificationService();