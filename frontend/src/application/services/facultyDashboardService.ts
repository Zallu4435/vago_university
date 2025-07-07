import httpClient from "../../frameworks/api/httpClient";

export interface DashboardStats {
  totalSessions: number;
  totalAssignments: number;
  totalAttendance: number;
}

export interface WeeklyAttendanceData {
  day: string;
  attendance: number;
}

export interface AssignmentPerformanceData {
  assignment: string;
  score: number;
  submissions: number;
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

export interface FacultyDashboardData {
  stats: DashboardStats;
  weeklyAttendance: WeeklyAttendanceData[];
  assignmentPerformance: AssignmentPerformanceData[];
  sessionDistribution: SessionDistributionData[];
  recentActivities: RecentActivity[];
}

class FacultyDashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await httpClient.get('/faculty/dashboard/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getWeeklyAttendance(): Promise<WeeklyAttendanceData[]> {
    try {
      const response = await httpClient.get('/faculty/dashboard/weekly-attendance');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching weekly attendance:', error);
      throw error;
    }
  }

  async getAssignmentPerformance(): Promise<AssignmentPerformanceData[]> {
    try {
      const response = await httpClient.get('/faculty/dashboard/assignment-performance');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching assignment performance:', error);
      throw error;
    }
  }

  async getSessionDistribution(): Promise<SessionDistributionData[]> {
    try {
      const response = await httpClient.get('/faculty/dashboard/session-distribution');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching session distribution:', error);
      throw error;
    }
  }

  async getRecentActivities(): Promise<RecentActivity[]> {
    try {
      const response = await httpClient.get('/faculty/dashboard/recent-activities');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  }

  async getAllDashboardData(): Promise<FacultyDashboardData> {
    try {
      const [
        stats,
        weeklyAttendance,
        assignmentPerformance,
        sessionDistribution,
        recentActivities
      ] = await Promise.all([
        this?.getDashboardStats(),
        this?.getWeeklyAttendance(),
        this?.getAssignmentPerformance(),
        this?.getSessionDistribution(),
        this?.getRecentActivities()
      ]);

      return {
        stats,
        weeklyAttendance,
        assignmentPerformance,
        sessionDistribution,
        recentActivities
      };
    } catch (error) {
      console.error('Error fetching all dashboard data:', error);
      throw error;
    }
  }
}

export const facultyDashboardService = new FacultyDashboardService(); 