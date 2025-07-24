import { useQuery } from '@tanstack/react-query';
import { studentDashboardService } from '../services/studentDashboardService';

type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
};

type StudentDashboardData = {
  announcements: any[];
  deadlines: any[];
  classes: any[];
  newEvents: EventItem[];
  calendarDays: number[];
  isLoading: boolean;
  isLoadingAnnouncements: boolean;
  isLoadingDeadlines: boolean;
  isLoadingClasses: boolean;
  isLoadingNewEvents: boolean;
  isLoadingCalendarDays: boolean;
  hasError: boolean;
  dashboardError: any;
  announcementsError: any;
  deadlinesError: any;
  classesError: any;
  newEventsError: any;
  calendarDaysError: any;
  refetchDashboard: () => Promise<void>;
  refetchAnnouncements: () => Promise<void>;
  refetchDeadlines: () => Promise<void>;
  refetchClasses: () => Promise<void>;
  refetchNewEvents: () => Promise<void>;
  refetchCalendarDays: () => Promise<void>;
};

export const useStudentDashboard = (): StudentDashboardData & {
  studentInfo?: any;
  studentInfoLoading: boolean;
  studentInfoError: any;
} => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: () => studentDashboardService.getAllDashboardData(),
    retry: 1,
  });

  const { data: studentInfo, isLoading: studentInfoLoading, error: studentInfoError } = useQuery({
    queryKey: ['student-dashboard-student-info'],
    queryFn: () => studentDashboardService.getStudentInfo(),
    retry: 1,
  });

  const dashboard: Partial<StudentDashboardData> = data || {};

  // Helper to wrap refetch to always return Promise<void>
  const safeRefetch = () => refetch().then(() => {});

  return {
    announcements: dashboard?.announcements || [],
    deadlines: dashboard?.deadlines || [],
    classes: dashboard?.classes || [],
    newEvents: dashboard?.newEvents || [],
    calendarDays: dashboard?.calendarDays || [],
    isLoading,
    isLoadingAnnouncements: isLoading,
    isLoadingDeadlines: isLoading,
    isLoadingClasses: isLoading,
    isLoadingNewEvents: isLoading,
    isLoadingCalendarDays: isLoading,
    hasError: isError,
    dashboardError: error,
    announcementsError: error,
    deadlinesError: error,
    classesError: error,
    newEventsError: error,
    calendarDaysError: error,
    refetchDashboard: safeRefetch,
    refetchAnnouncements: safeRefetch,
    refetchDeadlines: safeRefetch,
    refetchClasses: safeRefetch,
    refetchNewEvents: safeRefetch,
    refetchCalendarDays: safeRefetch,
    studentInfo: studentInfo?.data,
    studentInfoLoading,
    studentInfoError,
  };
}; 