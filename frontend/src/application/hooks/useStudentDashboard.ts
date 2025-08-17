import { useQuery } from '@tanstack/react-query';
import { studentDashboardService, Announcement, Deadline, ClassInfo, NewEvent, CalendarDayEntry } from '../services/studentDashboardService';

interface StudentInfo {
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  course?: string;
  profilePicture?: string;
}

type StudentDashboardData = {
  announcements: Announcement[];
  deadlines: Deadline[];
  classes: ClassInfo[];
  newEvents: NewEvent[];
  calendarDays: Record<number, CalendarDayEntry[]>;
  isLoading: boolean;
  isLoadingAnnouncements: boolean;
  isLoadingDeadlines: boolean;
  isLoadingClasses: boolean;
  isLoadingNewEvents: boolean;
  isLoadingCalendarDays: boolean;
  hasError: boolean;
  dashboardError: unknown;
  announcementsError: unknown;
  deadlinesError: unknown;
  classesError: unknown;
  newEventsError: unknown;
  calendarDaysError: unknown;
  refetchDashboard: () => Promise<void>;
  refetchAnnouncements: () => Promise<void>;
  refetchDeadlines: () => Promise<void>;
  refetchClasses: () => Promise<void>;
  refetchNewEvents: () => Promise<void>;
  refetchCalendarDays: () => Promise<void>;
};

export const useStudentDashboard = (): StudentDashboardData & {
  studentInfo?: StudentInfo;
  studentInfoLoading: boolean;
  studentInfoError: unknown;
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