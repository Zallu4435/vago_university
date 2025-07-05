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

  // Main dashboard data query
  const { 
    data: dashboardData, 
    isLoading: isDashboardLoading, 
    error: dashboardError,
    refetch: refetchDashboard 
  } = useQuery<DashboardData, Error>({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminDashboardService.getDashboardData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Individual metrics query
  const { 
    data: metrics, 
    isLoading: isMetricsLoading, 
    error: metricsError 
  } = useQuery<DashboardMetrics, Error>({
    queryKey: ['admin-dashboard-metrics'],
    queryFn: () => adminDashboardService.getMetrics(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !dashboardData, // Only fetch if main dashboard data is not available
  });

  // User growth data query
  const { 
    data: userGrowthData, 
    isLoading: isUserGrowthLoading, 
    error: userGrowthError 
  } = useQuery<UserGrowthData[], Error>({
    queryKey: ['admin-dashboard-user-growth'],
    queryFn: () => adminDashboardService.getUserGrowthData(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !dashboardData, // Only fetch if main dashboard data is not available
  });

  // Revenue data query
  const { 
    data: revenueData, 
    isLoading: isRevenueLoading, 
    error: revenueError 
  } = useQuery<RevenueData[], Error>({
    queryKey: ['admin-dashboard-revenue'],
    queryFn: () => adminDashboardService.getRevenueData(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !dashboardData, // Only fetch if main dashboard data is not available
  });

  // Performance data query
  const { 
    data: performanceData, 
    isLoading: isPerformanceLoading, 
    error: performanceError 
  } = useQuery<PerformanceData[], Error>({
    queryKey: ['admin-dashboard-performance'],
    queryFn: () => adminDashboardService.getPerformanceData(),
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: !dashboardData, // Only fetch if main dashboard data is not available
  });

  // Recent activities query
  const { 
    data: activities, 
    isLoading: isActivitiesLoading, 
    error: activitiesError 
  } = useQuery<ActivityItem[], Error>({
    queryKey: ['admin-dashboard-activities'],
    queryFn: () => adminDashboardService.getRecentActivities(),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !dashboardData, // Only fetch if main dashboard data is not available
  });

  // System alerts query
  const { 
    data: alerts, 
    isLoading: isAlertsLoading, 
    error: alertsError 
  } = useQuery<SystemAlert[], Error>({
    queryKey: ['admin-dashboard-alerts'],
    queryFn: () => adminDashboardService.getSystemAlerts(),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !dashboardData, // Only fetch if main dashboard data is not available
  });

  // Refresh dashboard mutation
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

  // Dismiss alert mutation
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

  // Mark activity as read mutation
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

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshDashboard();
      await refetchDashboard();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Get the best available data (prioritize main dashboard data, fallback to individual queries)
  const getMetrics = () => dashboardData?.metrics || metrics;
  const getUserGrowth = () => dashboardData?.userGrowth || userGrowthData;
  const getRevenue = () => dashboardData?.revenue || revenueData;
  const getPerformance = () => dashboardData?.performance || performanceData;
  const getActivities = () => dashboardData?.activities || activities;
  const getAlerts = () => dashboardData?.alerts || alerts;

  // Loading states
  const isLoading = isDashboardLoading || isMetricsLoading || isUserGrowthLoading || 
                   isRevenueLoading || isPerformanceLoading || isActivitiesLoading || 
                   isAlertsLoading || isRefreshing;

  // Error handling
  const error = dashboardError || metricsError || userGrowthError || revenueError || 
                performanceError || activitiesError || alertsError;

  return {
    // Data
    metrics: getMetrics(),
    userGrowth: getUserGrowth(),
    revenue: getRevenue(),
    performance: getPerformance(),
    activities: getActivities(),
    alerts: getAlerts(),
    
    // Loading states
    isLoading,
    isRefreshing,
    isDashboardLoading,
    isMetricsLoading,
    isUserGrowthLoading,
    isRevenueLoading,
    isPerformanceLoading,
    isActivitiesLoading,
    isAlertsLoading,
    
    // Error handling
    error,
    
    // Actions
    refreshDashboard: handleRefresh,
    dismissAlert,
    markActivityAsRead,
    refetchDashboard,
  };
}; 