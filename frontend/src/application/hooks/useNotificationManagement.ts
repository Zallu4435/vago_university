import { useState, useEffect, useCallback } from 'react';
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
  search?: string;
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
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const limit = 10;

  const isAdmin = user?.role === 'admin';

  const { data: notificationsData, isLoading, error, isFetching } = useQuery({
    queryKey: ['notifications', page, filters, limit, isAdmin],
    queryFn: () => {
      return notificationService.getNotifications({
        isAdmin,
        page,
        limit,
        recipientType: filters.recipientType !== 'All' ? filters.recipientType.toLowerCase().replace(/\s+/g, '_') : undefined,
        status: filters.status !== 'All' ? filters.status.toLowerCase() : undefined,
        dateRange: filters.dateRange !== 'All' ? filters.dateRange : undefined,
        search: filters.search ? filters.search : undefined,
      });
    },
    enabled: !!user,
  });

  useEffect(() => {
    setAllNotifications([]);
    setPage(1);
    setHasMore(true);
  }, [filters, user]);

  useEffect(() => {
    if (notificationsData && notificationsData.notifications) {
      setAllNotifications((prev) => {
        const ids = new Set(prev.map((n) => n._id));
        const newOnes = notificationsData.notifications.filter((n) => !ids.has(n._id));
        return page === 1 ? notificationsData.notifications : [...prev, ...newOnes];
      });
      setHasMore(page < (notificationsData.totalPages || 1));
    }
  }, [notificationsData, page]);

  const fetchNextPage = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await notificationService.getNotifications({
        isAdmin,
        page: nextPage,
        limit,
        recipientType: filters.recipientType !== 'All' ? filters.recipientType.toLowerCase().replace(/\s+/g, '_') : undefined,
        status: filters.status !== 'All' ? filters.status.toLowerCase() : undefined,
        dateRange: filters.dateRange !== 'All' ? filters.dateRange : undefined,
        search: filters.search ? filters.search : undefined,
      });
      if (data && data.notifications && data.notifications.length > 0) {
        setAllNotifications((prev) => {
          const ids = new Set(prev.map((n) => n._id));
          const newOnes = data.notifications.filter((n) => !ids.has(n._id));
          return [...prev, ...newOnes];
        });
        setPage(nextPage);
        setHasMore(nextPage < (data.totalPages || 1));
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, page, filters, isAdmin]);

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
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to fetch notification details');
    },
  });

  const { mutateAsync: createNotification } = useMutation({
    mutationFn: (data: Omit<Notification, '_id' | 'createdAt' | 'status'>) => notificationService.createNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification sent successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send notification');
    },
  });

  const { mutateAsync: deleteNotification } = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete notification');
    },
  });

  const { mutateAsync: markAsRead } = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification marked as read');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to mark notification as read');
    },
  });

  const { mutateAsync: markAllAsRead } = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to mark all notifications as read');
    },
  });

  return {
    notifications: allNotifications,
    totalPages: notificationsData?.totalPages || 0,
    page,
    setPage,
    filters,
    setFilters,
    isLoading: isLoading || isFetching,
    error,
    createNotification,
    deleteNotification,
    markAsRead,
    markAllAsRead,
    getNotificationDetails,
    selectedNotification,
    isLoadingNotificationDetails,
    fetchNextPage,
    hasMore,
    isLoadingMore,
    setSelectedNotificationId,
  };
};