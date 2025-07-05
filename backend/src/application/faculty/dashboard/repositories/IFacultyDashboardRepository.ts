import {
  GetFacultyDashboardStatsRequestDTO,
  GetFacultyDashboardDataRequestDTO,
  GetFacultyWeeklyAttendanceRequestDTO,
  GetFacultyCoursePerformanceRequestDTO,
  GetFacultySessionDistributionRequestDTO,
  GetFacultyRecentActivitiesRequestDTO,
  GetFacultySystemStatusRequestDTO,
} from "../../../../domain/faculty/dashboard/dtos/FacultyDashboardRequestDTOs";
import {
  GetFacultyDashboardStatsResponseDTO,
  GetFacultyDashboardDataResponseDTO,
  GetFacultyWeeklyAttendanceResponseDTO,
  GetFacultyCoursePerformanceResponseDTO,
  GetFacultySessionDistributionResponseDTO,
  GetFacultyRecentActivitiesResponseDTO,
  GetFacultySystemStatusResponseDTO,
} from "../../../../domain/faculty/dashboard/dtos/FacultyDashboardResponseDTOs";

export interface IFacultyDashboardRepository {
  getDashboardStats(params: GetFacultyDashboardStatsRequestDTO): Promise<GetFacultyDashboardStatsResponseDTO>;
  getDashboardData(params: GetFacultyDashboardDataRequestDTO): Promise<GetFacultyDashboardDataResponseDTO>;
  getWeeklyAttendance(params: GetFacultyWeeklyAttendanceRequestDTO): Promise<GetFacultyWeeklyAttendanceResponseDTO>;
  getCoursePerformance(params: GetFacultyCoursePerformanceRequestDTO): Promise<GetFacultyCoursePerformanceResponseDTO>;
  getSessionDistribution(params: GetFacultySessionDistributionRequestDTO): Promise<GetFacultySessionDistributionResponseDTO>;
  getRecentActivities(params: GetFacultyRecentActivitiesRequestDTO): Promise<GetFacultyRecentActivitiesResponseDTO>;
  getSystemStatus(params: GetFacultySystemStatusRequestDTO): Promise<GetFacultySystemStatusResponseDTO>;
} 