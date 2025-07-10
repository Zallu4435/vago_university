import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { notificationService } from '../services/notification.service';
import { useSelector } from 'react-redux';
import { RootState } from '../../appStore/store';
import { User } from '../../domain/types/userTypes';
import { Notification } from '../../domain/types/management/notificationmanagement';

interface Filters {
  recipientType: string;
  status: string;
  dateRange: string;
}

export const useNotificationManagement = () => {
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.auth.user) as User | null;
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<Filters>({
    recipientType: 'All',
    status: 'All',
    dateRange: 'All',
  });
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const limit = 10;

  const isAdmin = user?.role === 'admin';

  const getDateRangeFilter = (dateRange: string): string | undefined => {
    if (!dateRange || dateRange === 'All') return undefined;

    const now = new Date();
    const startDate = new Date();

    const range = dateRange.toLowerCase();

    switch (range) {
      case 'last week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'last month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'last 3 months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'last 6 months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'last year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return undefined;
    }

    return `${startDate.toISOString()},${now.toISOString()}`;
  };

  const { data: notificationsData, isLoading, error } = useQuery({
    queryKey: ['notifications', page, filters, limit, isAdmin],
    queryFn: () => {
      const dateRange = getDateRangeFilter(filters.dateRange);
      const recipientType =
        filters.recipientType !== 'All' ? filters.recipientType.toLowerCase().replace(/\s+/g, '_') : undefined;
      const status = filters.status !== 'All' ? filters.status.toLowerCase() : undefined;

      return notificationService.getNotifications(isAdmin, page, limit, recipientType, status, dateRange);
    },
    enabled: !!user, // Only fetch when user is authenticated
  });

  const { data: selectedNotification, isLoading: isLoadingNotificationDetails } = useQuery({
    queryKey: ['notificationDetails', selectedNotificationId],
    queryFn: () => {
      if (!selectedNotificationId) return null;
      return notificationService.getNotificationDetails(selectedNotificationId);
    },
    enabled: !!selectedNotificationId,
  });

  const { mutateAsync: getNotificationDetails } = useMutation({
    mutationFn: (id: string) => notificationService.getNotificationDetails(id),
    onError: (error: any) => {
      toast.error(error.message || 'Failed to fetch notification details');
    },
  });

  const { mutateAsync: createNotification } = useMutation({
    mutationFn: (data: Omit<Notification, '_id' | 'createdAt' | 'status'>) => notificationService.createNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send notification');
    },
  });

  const { mutateAsync: deleteNotification } = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete notification');
    },
  });

  const { mutateAsync: markAsRead } = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification marked as read');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark notification as read');
    },
  });

  const { mutateAsync: markAllAsRead } = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark all notifications as read');
    },
  });

  return {
    notifications: notificationsData?.notifications || [],
    totalPages: notificationsData?.totalPages || 0,
    page,
    setPage,
    filters,
    setFilters,
    isLoading,
    error,
    createNotification,
    deleteNotification,
    markAsRead,
    markAllAsRead,
    getNotificationDetails,
    selectedNotification,
    isLoadingNotificationDetails,
  };
};