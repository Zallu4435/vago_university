import { useQuery, useQueryClient } from '@tanstack/react-query';
import { facultyDashboardService, FacultyDashboardData, DashboardStats, WeeklyAttendanceData, CoursePerformanceData, SessionDistributionData, RecentActivity } from '../services/facultyDashboardService';

export const useFacultyDashboard = () => {
  const queryClient = useQueryClient();

  // Query keys
  const dashboardKeys = {
    all: ['faculty', 'dashboard'] as const,
    stats: () => [...dashboardKeys.all, 'stats'] as const,
    weeklyAttendance: () => [...dashboardKeys.all, 'weekly-attendance'] as const,
    coursePerformance: () => [...dashboardKeys.all, 'course-performance'] as const,
    sessionDistribution: () => [...dashboardKeys.all, 'session-distribution'] as const,
    recentActivities: () => [...dashboardKeys.all, 'recent-activities'] as const,
  };

  // Fetch all dashboard data
  const {
    data: dashboardData,
    isLoading: isLoadingDashboard,
    error: dashboardError,
    refetch: refetchDashboard
  } = useQuery({
    queryKey: dashboardKeys.all,
    queryFn: facultyDashboardService.getAllDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Individual data queries for more granular control
  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError
  } = useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: facultyDashboardService.getDashboardStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !dashboardData, // Only fetch if not already available
  });

  const {
    data: weeklyAttendance,
    isLoading: isLoadingWeeklyAttendance,
    error: weeklyAttendanceError
  } = useQuery({
    queryKey: dashboardKeys.weeklyAttendance(),
    queryFn: facultyDashboardService.getWeeklyAttendance,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !dashboardData, // Only fetch if not already available
  });

  // Debug logging for weekly attendance
  console.log('🔍 [useFacultyDashboard] weeklyAttendance data:', weeklyAttendance);
  console.log('🔍 [useFacultyDashboard] isLoadingWeeklyAttendance:', isLoadingWeeklyAttendance);
  console.log('🔍 [useFacultyDashboard] weeklyAttendanceError:', weeklyAttendanceError);

  const {
    data: coursePerformance,
    isLoading: isLoadingCoursePerformance,
    error: coursePerformanceError
  } = useQuery({
    queryKey: dashboardKeys.coursePerformance(),
    queryFn: facultyDashboardService.getCoursePerformance,
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !dashboardData, // Only fetch if not already available
  });

  const {
    data: sessionDistribution,
    isLoading: isLoadingSessionDistribution,
    error: sessionDistributionError
  } = useQuery({
    queryKey: dashboardKeys.sessionDistribution(),
    queryFn: facultyDashboardService.getSessionDistribution,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !dashboardData, // Only fetch if not already available
  });

  const {
    data: recentActivities,
    isLoading: isLoadingRecentActivities,
    error: recentActivitiesError
  } = useQuery({
    queryKey: dashboardKeys.recentActivities(),
    queryFn: facultyDashboardService.getRecentActivities,
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !dashboardData, // Only fetch if not already available
  });



  // Computed values - use dashboard data if available, otherwise use individual queries
  const finalStats = dashboardData?.stats || stats;
  const finalWeeklyAttendance = dashboardData?.weeklyAttendance || weeklyAttendance;
  const finalCoursePerformance = dashboardData?.coursePerformance || coursePerformance;
  const finalSessionDistribution = dashboardData?.sessionDistribution || sessionDistribution;
  const finalRecentActivities = dashboardData?.recentActivities || recentActivities;

  // Loading states
  const isLoading = isLoadingDashboard || 
    (!dashboardData && (isLoadingStats || isLoadingWeeklyAttendance || isLoadingCoursePerformance || 
     isLoadingSessionDistribution || isLoadingRecentActivities));

  // Error states
  const hasError = dashboardError || statsError || weeklyAttendanceError || coursePerformanceError || 
    sessionDistributionError || recentActivitiesError;

  return {
    // Data
    stats: finalStats,
    weeklyAttendance: finalWeeklyAttendance,
    coursePerformance: finalCoursePerformance,
    sessionDistribution: finalSessionDistribution,
    recentActivities: finalRecentActivities,
    
    // Loading states
    isLoading,
    isLoadingStats,
    isLoadingWeeklyAttendance,
    isLoadingCoursePerformance,
    isLoadingSessionDistribution,
    isLoadingRecentActivities,
    
    // Error states
    hasError,
    dashboardError,
    statsError,
    weeklyAttendanceError,
    coursePerformanceError,
    sessionDistributionError,
    recentActivitiesError,
    
    // Utilities
    refetchDashboard,
    refetchStats: () => queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() }),
    refetchRecentActivities: () => queryClient.invalidateQueries({ queryKey: dashboardKeys.recentActivities() }),
  };
}; 