import { useQuery, useQueryClient } from '@tanstack/react-query';
import { facultyDashboardService } from '../services/facultyDashboardService';

export const useFacultyDashboard = () => {
  const queryClient = useQueryClient();

  const dashboardKeys = {
    all: ['faculty', 'dashboard'] as const,
    stats: () => [...dashboardKeys.all, 'stats'] as const,
    weeklyAttendance: () => [...dashboardKeys.all, 'weekly-attendance'] as const,
    assignmentPerformance: () => [...dashboardKeys.all, 'assignment-performance'] as const,
    sessionDistribution: () => [...dashboardKeys.all, 'session-distribution'] as const,
    recentActivities: () => [...dashboardKeys.all, 'recent-activities'] as const,
  };

  const {
    data: dashboardData,
    isLoading: isLoadingDashboard,
    error: dashboardError,
    refetch: refetchDashboard
  } = useQuery({
    queryKey: dashboardKeys.all,
    queryFn: facultyDashboardService.getAllDashboardData,
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
  });

  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError
  } = useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: facultyDashboardService.getDashboardStats,
    staleTime: 2 * 60 * 1000, 
    enabled: !dashboardData, 
  });

  const {
    data: weeklyAttendance,
    isLoading: isLoadingWeeklyAttendance,
    error: weeklyAttendanceError
  } = useQuery({
    queryKey: dashboardKeys.weeklyAttendance(),
    queryFn: facultyDashboardService.getWeeklyAttendance,
    staleTime: 5 * 60 * 1000, 
    enabled: !dashboardData, 
  });

  const {
    data: assignmentPerformance,
    isLoading: isLoadingAssignmentPerformance,
    error: assignmentPerformanceError
  } = useQuery({
    queryKey: dashboardKeys.assignmentPerformance(),
    queryFn: facultyDashboardService.getAssignmentPerformance,
    staleTime: 10 * 60 * 1000, 
    enabled: !dashboardData, 
  });

  const {
    data: sessionDistribution,
    isLoading: isLoadingSessionDistribution,
    error: sessionDistributionError
  } = useQuery({
    queryKey: dashboardKeys.sessionDistribution(),
    queryFn: facultyDashboardService.getSessionDistribution,
    staleTime: 5 * 60 * 1000, 
    enabled: !dashboardData, 
  });

  const {
    data: recentActivities,
    isLoading: isLoadingRecentActivities,
    error: recentActivitiesError
  } = useQuery({
    queryKey: dashboardKeys.recentActivities(),
    queryFn: facultyDashboardService.getRecentActivities,
    staleTime: 1 * 60 * 1000, 
    enabled: !dashboardData, 
  });

  const finalStats = dashboardData?.stats || stats;
  const finalWeeklyAttendance = dashboardData?.weeklyAttendance || weeklyAttendance;
  const finalAssignmentPerformance = dashboardData?.assignmentPerformance || assignmentPerformance;
  const finalSessionDistribution = dashboardData?.sessionDistribution || sessionDistribution;
  const finalRecentActivities = dashboardData?.recentActivities || recentActivities;

  const isLoading = isLoadingDashboard || 
    (!dashboardData && (isLoadingStats || isLoadingWeeklyAttendance || isLoadingAssignmentPerformance || 
     isLoadingSessionDistribution || isLoadingRecentActivities));

  const hasError = dashboardError || statsError || weeklyAttendanceError || assignmentPerformanceError || 
    sessionDistributionError || recentActivitiesError;

  return {
  
    stats: finalStats,
    weeklyAttendance: finalWeeklyAttendance,
    assignmentPerformance: finalAssignmentPerformance,
    sessionDistribution: finalSessionDistribution,
    recentActivities: finalRecentActivities,
    
    isLoading,
    isLoadingStats,
    isLoadingWeeklyAttendance,
    isLoadingAssignmentPerformance,
    isLoadingSessionDistribution,
    isLoadingRecentActivities,
    
    hasError,
    dashboardError,
    statsError,
    weeklyAttendanceError,
    assignmentPerformanceError,
    sessionDistributionError,
    recentActivitiesError,
    
    refetchDashboard,
    refetchStats: () => queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() }),
    refetchRecentActivities: () => queryClient.invalidateQueries({ queryKey: dashboardKeys.recentActivities() }),
  };
}; 