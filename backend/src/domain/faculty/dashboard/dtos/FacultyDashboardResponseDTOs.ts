export interface DashboardStatsResponseDTO {
  activeSessions: number;
  todayAttendance: number;
  pendingApprovals: number;
  totalStudents: number;
}

export interface WeeklyAttendanceResponseDTO {
  day: string;
  attendance: number;
}

export interface CoursePerformanceResponseDTO {
  course: string;
  score: number;
}

export interface SessionDistributionResponseDTO {
  name: string;
  value: number;
  color: string;
}

export interface RecentActivityResponseDTO {
  id: string;
  type: 'attendance' | 'assignment' | 'announcement' | 'system';
  message: string;
  time: string;
}



export interface FacultyDashboardDataResponseDTO {
  stats: DashboardStatsResponseDTO;
  weeklyAttendance: WeeklyAttendanceResponseDTO[];
  coursePerformance: CoursePerformanceResponseDTO[];
  sessionDistribution: SessionDistributionResponseDTO[];
  recentActivities: RecentActivityResponseDTO[];
}

export interface GetFacultyDashboardStatsResponseDTO {
  stats: DashboardStatsResponseDTO;
}

export interface GetFacultyDashboardDataResponseDTO {
  dashboardData: FacultyDashboardDataResponseDTO;
}

export interface GetFacultyWeeklyAttendanceResponseDTO {
  weeklyAttendance: WeeklyAttendanceResponseDTO[];
}

export interface GetFacultyCoursePerformanceResponseDTO {
  coursePerformance: CoursePerformanceResponseDTO[];
}

export interface GetFacultySessionDistributionResponseDTO {
  sessionDistribution: SessionDistributionResponseDTO[];
}

export interface GetFacultyRecentActivitiesResponseDTO {
  recentActivities: RecentActivityResponseDTO[];
}

 