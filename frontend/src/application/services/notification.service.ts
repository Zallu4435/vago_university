import { Notification, NotificationApiResponse } from '../../domain/types/management/notificationmanagement';
import httpClient from '../../frameworks/api/httpClient';

class NotificationService {
  async getNotifications(filters: {
    isAdmin?: boolean,
    page?: number,
    limit?: number,
    recipientType?: string,
    status?: string,
    dateRange?: string,
    search?: string
  }): Promise<NotificationApiResponse> {
    try {
      const endpoint = '/admin/notifications';
      const response = await httpClient.get<NotificationApiResponse>(endpoint, {
        params: filters,
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch notifications');
    }
  }

  async getNotificationDetails(id: string): Promise<Notification> {
    try {
      const response = await httpClient.get<Notification>(`/admin/notifications/${id}`);
      return response.data.data;
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

  async markAsRead(id: string): Promise<void> {
    try {
      await httpClient.patch(`/admin/notifications/${id}/read`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to mark notification as read');
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await httpClient.patch('/admin/notifications/read-all');
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to mark all notifications as read');
    }
  }
}

export const notificationService = new NotificationService();