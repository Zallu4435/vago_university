import httpClient from "../../frameworks/api/httpClient";

export interface DashboardStats {
  activeSessions: number;
  todayAttendance: number;
  pendingApprovals: number;
  totalStudents: number;
}

export interface WeeklyAttendanceData {
  day: string;
  attendance: number;
}

export interface CoursePerformanceData {
  course: string;
  score: number;
}

export interface SessionDistributionData {
  name: string;
  value: number;
  color: string;
}

export interface RecentActivity {
  id: string;
  type: 'attendance' | 'assignment' | 'announcement' | 'system';
  message: string;
  time: string;
}

export interface SystemStatus {
  serverStatus: 'online' | 'offline';
  database: 'connected' | 'disconnected';
  lastBackup: string;
}

export interface FacultyDashboardData {
  stats: DashboardStats;
  weeklyAttendance: WeeklyAttendanceData[];
  coursePerformance: CoursePerformanceData[];
  sessionDistribution: SessionDistributionData[];
  recentActivities: RecentActivity[];
  systemStatus: SystemStatus;
}

class FacultyDashboardService {
  // Fetch dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await httpClient.get('/faculty/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Fetch weekly attendance data
  async getWeeklyAttendance(): Promise<WeeklyAttendanceData[]> {
    try {
      const response = await httpClient.get('/faculty/dashboard/weekly-attendance');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching weekly attendance:', error);
      throw error;
    }
  }

  // Fetch course performance data
  async getCoursePerformance(): Promise<CoursePerformanceData[]> {
    try {
      const response = await httpClient.get('/faculty/dashboard/course-performance');
      return response.data;
    } catch (error) {
      console.error('Error fetching course performance:', error);
      throw error;
    }
  }

  // Fetch session distribution data.data
  async getSessionDistribution(): Promise<SessionDistributionData[]> {
    try {
      const response = await httpClient.get('/faculty/dashboard/session-distribution');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching session distribution:', error);
      throw error;
    }
  }

  // Fetch recent activities
  async getRecentActivities(): Promise<RecentActivity[]> {
    try {
      const response = await httpClient.get('/faculty/dashboard/recent-activities');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  }

  // Fetch system status
  async getSystemStatus(): Promise<SystemStatus> {
    try {
      const response = await httpClient.get('/faculty/dashboard/system-status');
      return response.data;
    } catch (error) {
      console.error('Error fetching system status:', error);
      throw error;
    }
  }

  // Fetch all dashboard data at once
  async getAllDashboardData(): Promise<FacultyDashboardData> {
    try {
      const [
        stats,
        weeklyAttendance,
        coursePerformance,
        sessionDistribution,
        recentActivities,
        systemStatus
      ] = await Promise.all([
        this?.getDashboardStats(),
        this?.getWeeklyAttendance(),
        this?.getCoursePerformance(),
        this?.getSessionDistribution(),
        this?.getRecentActivities(),
        this?.getSystemStatus()
      ]);

      return {
        stats,
        weeklyAttendance,
        coursePerformance,
        sessionDistribution,
        recentActivities,
        systemStatus
      };
    } catch (error) {
      console.error('Error fetching all dashboard data:', error);
      throw error;
    }
  }
}

export const facultyDashboardService = new FacultyDashboardService(); 