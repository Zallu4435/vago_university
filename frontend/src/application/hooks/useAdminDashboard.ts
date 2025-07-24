import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  adminDashboardService,
  DashboardData,
  DashboardMetrics,
  UserGrowthData,
  RevenueData,
  PerformanceData,
  ActivityItem,
  SystemAlert
} from '../services/adminDashboard.service';

export const useAdminDashboard = () => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard
  } = useQuery<DashboardData, Error>({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminDashboardService.getDashboardData(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: metrics,
    isLoading: isMetricsLoading,
    error: metricsError
  } = useQuery<DashboardMetrics, Error>({
    queryKey: ['admin-dashboard-metrics'],
    queryFn: () => adminDashboardService.getMetrics(),
    staleTime: 2 * 60 * 1000,
    enabled: !dashboardData,
  });

  const {
    data: userGrowthData,
    isLoading: isUserGrowthLoading,
    error: userGrowthError
  } = useQuery<UserGrowthData[], Error>({
    queryKey: ['admin-dashboard-user-growth'],
    queryFn: () => adminDashboardService.getUserGrowthData(),
    staleTime: 10 * 60 * 1000,
    enabled: !dashboardData,
  });

  const {
    data: revenueData,
    isLoading: isRevenueLoading,
    error: revenueError
  } = useQuery<RevenueData[], Error>({
    queryKey: ['admin-dashboard-revenue'],
    queryFn: () => adminDashboardService.getRevenueData(),
    staleTime: 10 * 60 * 1000,
    enabled: !dashboardData,
  });

  const {
    data: performanceData,
    isLoading: isPerformanceLoading,
    error: performanceError
  } = useQuery<PerformanceData[], Error>({
    queryKey: ['admin-dashboard-performance'],
    queryFn: () => adminDashboardService.getPerformanceData(),
    staleTime: 15 * 60 * 1000,
    enabled: !dashboardData,
  });

  const {
    data: activities,
    isLoading: isActivitiesLoading,
    error: activitiesError
  } = useQuery<ActivityItem[], Error>({
    queryKey: ['admin-dashboard-activities'],
    queryFn: () => adminDashboardService.getRecentActivities(),
    staleTime: 1 * 60 * 1000,
    enabled: !dashboardData,
  });

  const {
    data: alerts,
    isLoading: isAlertsLoading,
    error: alertsError
  } = useQuery<SystemAlert[], Error>({
    queryKey: ['admin-dashboard-alerts'],
    queryFn: () => adminDashboardService.getSystemAlerts(),
    staleTime: 30 * 1000,
    enabled: !dashboardData,
  });

  const { mutateAsync: refreshDashboard } = useMutation({
    mutationFn: () => adminDashboardService.refreshDashboard(),
    onSuccess: (data) => {
      queryClient.setQueryData(['admin-dashboard'], data);
      toast.success('Dashboard refreshed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to refresh dashboard');
    },
  });

  const { mutateAsync: dismissAlert } = useMutation({
    mutationFn: (alertId: string) => adminDashboardService.dismissAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      toast.success('Alert dismissed');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to dismiss alert');
    },
  });

  const { mutateAsync: markActivityAsRead } = useMutation({
    mutationFn: (activityId: string) => adminDashboardService.markActivityAsRead(activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-activities'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark activity as read');
    },
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshDashboard();
      await refetchDashboard();
    } finally {
      setIsRefreshing(false);
    }
  };

  const isLoading = isDashboardLoading || isMetricsLoading || isUserGrowthLoading ||
    isRevenueLoading || isPerformanceLoading || isActivitiesLoading ||
    isAlertsLoading || isRefreshing;

  const error = dashboardError || metricsError || userGrowthError || revenueError ||
    performanceError || activitiesError || alertsError;

  return {
    // Data
    metrics,
    userGrowth: userGrowthData,
    revenue: revenueData,
    performance: performanceData,
    activities,
    alerts,

    isLoading,
    isRefreshing,
    isDashboardLoading,
    isMetricsLoading,
    isUserGrowthLoading,
    isRevenueLoading,
    isPerformanceLoading,
    isActivitiesLoading,
    isAlertsLoading,

    error,

    refreshDashboard: handleRefresh,
    dismissAlert,
    markActivityAsRead,
    refetchDashboard,
  };
}; 