import {
  GetFacultyDashboardStatsRequestDTO,
  GetFacultyDashboardDataRequestDTO,
  GetFacultyWeeklyAttendanceRequestDTO,
  GetFacultyCoursePerformanceRequestDTO,
  GetFacultySessionDistributionRequestDTO,
  GetFacultyRecentActivitiesRequestDTO,
} from "../../../../domain/faculty/dashboard/dtos/FacultyDashboardRequestDTOs";
import {
  GetFacultyDashboardStatsResponseDTO,
  GetFacultyDashboardDataResponseDTO,
  GetFacultyWeeklyAttendanceResponseDTO,
  GetFacultyCoursePerformanceResponseDTO,
  GetFacultySessionDistributionResponseDTO,
  GetFacultyRecentActivitiesResponseDTO,
} from "../../../../domain/faculty/dashboard/dtos/FacultyDashboardResponseDTOs";

export interface IFacultyDashboardRepository {
  getDashboardStats(params: GetFacultyDashboardStatsRequestDTO): Promise<GetFacultyDashboardStatsResponseDTO>;
  getDashboardData(params: GetFacultyDashboardDataRequestDTO): Promise<GetFacultyDashboardDataResponseDTO>;
  getWeeklyAttendance(params: GetFacultyWeeklyAttendanceRequestDTO): Promise<GetFacultyWeeklyAttendanceResponseDTO>;
  getAssignmentPerformance(params: GetFacultyCoursePerformanceRequestDTO): Promise<GetFacultyCoursePerformanceResponseDTO>;
  getSessionDistribution(params: GetFacultySessionDistributionRequestDTO): Promise<GetFacultySessionDistributionResponseDTO>;
  getRecentActivities(params: GetFacultyRecentActivitiesRequestDTO): Promise<GetFacultyRecentActivitiesResponseDTO>;
} 