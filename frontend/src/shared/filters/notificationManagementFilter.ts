import { Notification } from '../../domain/types/notification.types';

export function filterNotifications(
  notifications: Notification[],
  filters: { recipientType: string; status: string; dateRange?: string },
  searchQuery: string
): Notification[] {
  return notifications.filter((notification) => {
    const matchesSearch = searchQuery
      ? notification.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.createdBy?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (notification.recipientType === 'individual' &&
          notification.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    const matchesRecipientType =
      filters.recipientType === 'All' ||
      notification.recipientType.toLowerCase() === filters.recipientType.toLowerCase().replace(/\s+/g, '_');
    const matchesStatus =
      filters.status === 'All' || notification.status.toLowerCase() === filters.status.toLowerCase();
    return matchesSearch && matchesRecipientType && matchesStatus;
  });
} 