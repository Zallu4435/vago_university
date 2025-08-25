import {
  GetFacultyDashboardStatsResponseDTO,
  GetFacultyDashboardDataResponseDTO,
  GetFacultyWeeklyAttendanceResponseDTO,
  GetFacultyCoursePerformanceResponseDTO,
  GetFacultySessionDistributionResponseDTO,
  GetFacultyRecentActivitiesResponseDTO,
} from "../../../../domain/faculty/dashboard/dtos/FacultyDashboardResponseDTOs";

export interface IFacultyDashboardRepository {
  getDashboardStats(facultyId: string): Promise<GetFacultyDashboardStatsResponseDTO>;
  getDashboardData(facultyId: string): Promise<GetFacultyDashboardDataResponseDTO>;
  getWeeklyAttendance(facultyId: string): Promise<GetFacultyWeeklyAttendanceResponseDTO>;
  getAssignmentPerformance(facultyId: string): Promise<GetFacultyCoursePerformanceResponseDTO>;
  getSessionDistribution(facultyId: string): Promise<GetFacultySessionDistributionResponseDTO>;
  getRecentActivities(facultyId: string): Promise<GetFacultyRecentActivitiesResponseDTO>;
} 