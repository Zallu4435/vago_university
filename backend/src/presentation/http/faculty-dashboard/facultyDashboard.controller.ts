import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IFacultyDashboardController } from '../IHttp';
import {
  GetFacultyDashboardStatsUseCase,
  GetFacultyDashboardDataUseCase,
  GetFacultyWeeklyAttendanceUseCase,
  GetFacultyCoursePerformanceUseCase,
  GetFacultySessionDistributionUseCase,
  GetFacultyRecentActivitiesUseCase,
} from "../../../application/faculty/dashboard/useCases/FacultyDashboardUseCases";
import {
  GetFacultyDashboardStatsRequestDTO,
  GetFacultyDashboardDataRequestDTO,
  GetFacultyWeeklyAttendanceRequestDTO,
  GetFacultyCoursePerformanceRequestDTO,
  GetFacultySessionDistributionRequestDTO,
  GetFacultyRecentActivitiesRequestDTO,
} from "../../../domain/faculty/dashboard/dtos/FacultyDashboardRequestDTOs";
import {
  GetFacultyDashboardStatsResponseDTO,
  GetFacultyDashboardDataResponseDTO,
  GetFacultyWeeklyAttendanceResponseDTO,
  GetFacultyCoursePerformanceResponseDTO,
  GetFacultySessionDistributionResponseDTO,
  GetFacultyRecentActivitiesResponseDTO,
} from "../../../domain/faculty/dashboard/dtos/FacultyDashboardResponseDTOs";

// Error response type for clean architecture
interface ErrorResponse {
  error: string;
  message?: string;
  [key: string]: unknown;
}

export class FacultyDashboardController implements IFacultyDashboardController {
  private httpErrors: HttpErrors;
  private httpSuccess: HttpSuccess;

  constructor(
    private getFacultyDashboardStatsUseCase: GetFacultyDashboardStatsUseCase,
    private getFacultyDashboardDataUseCase: GetFacultyDashboardDataUseCase,
    private getFacultyWeeklyAttendanceUseCase: GetFacultyWeeklyAttendanceUseCase,
    private getFacultyCoursePerformanceUseCase: GetFacultyCoursePerformanceUseCase,
    private getFacultySessionDistributionUseCase: GetFacultySessionDistributionUseCase,
    private getFacultyRecentActivitiesUseCase: GetFacultyRecentActivitiesUseCase
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async getDashboardStats(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const facultyId = httpRequest.user?.userId || httpRequest.params?.facultyId;
    if (!facultyId) {
      return this.httpErrors.error_400("Faculty ID is required");
    }
    const params: GetFacultyDashboardStatsRequestDTO = { facultyId };
    const result = await this.getFacultyDashboardStatsUseCase.execute(params);
    if (result.success) {
      return this.httpSuccess.success_200((result.data as GetFacultyDashboardStatsResponseDTO).stats);
    } else {
      return this.httpErrors.error_400((result.data as ErrorResponse)?.error || "Failed to fetch dashboard stats");
    }
  }

  async getDashboardData(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const facultyId = httpRequest.user?.userId || httpRequest.params?.facultyId;
    if (!facultyId) {
      return this.httpErrors.error_400("Faculty ID is required");
    }
    const params: GetFacultyDashboardDataRequestDTO = { facultyId };
    const result = await this.getFacultyDashboardDataUseCase.execute(params);
    if (result.success) {
      return this.httpSuccess.success_200((result.data as GetFacultyDashboardDataResponseDTO).dashboardData);
    } else {
      return this.httpErrors.error_400((result.data as ErrorResponse)?.error || "Failed to fetch dashboard data");
    }
  }

  async getWeeklyAttendance(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const facultyId = httpRequest.user?.userId || httpRequest.params?.facultyId;
    if (!facultyId) {
      return this.httpErrors.error_400("Faculty ID is required");
    }
    const params: GetFacultyWeeklyAttendanceRequestDTO = { facultyId };
    const result = await this.getFacultyWeeklyAttendanceUseCase.execute(params);
    if (result.success) {
      return this.httpSuccess.success_200((result.data as GetFacultyWeeklyAttendanceResponseDTO).weeklyAttendance);
    } else {
      return this.httpErrors.error_400((result.data as ErrorResponse)?.error || "Failed to fetch weekly attendance");
    }
  }

  async getCoursePerformance(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const facultyId = httpRequest.user?.userId || httpRequest.params?.facultyId;
    if (!facultyId) {
      return this.httpErrors.error_400("Faculty ID is required");
    }
    const params: GetFacultyCoursePerformanceRequestDTO = { facultyId };
    const result = await this.getFacultyCoursePerformanceUseCase.execute(params);
    if (result.success) {
      return this.httpSuccess.success_200((result.data as GetFacultyCoursePerformanceResponseDTO).assignmentPerformance);
    } else {
      return this.httpErrors.error_400((result.data as ErrorResponse)?.error || "Failed to fetch assignment performance");
    }
  }

  async getSessionDistribution(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const facultyId = httpRequest.user?.userId || httpRequest.params?.facultyId;
    if (!facultyId) {
      return this.httpErrors.error_400("Faculty ID is required");
    }
    const params: GetFacultySessionDistributionRequestDTO = { facultyId };
    const result = await this.getFacultySessionDistributionUseCase.execute(params);
    if (result.success) {
      return this.httpSuccess.success_200((result.data as GetFacultySessionDistributionResponseDTO).sessionDistribution);
    } else {
      return this.httpErrors.error_400((result.data as ErrorResponse)?.error || "Failed to fetch session distribution");
    }
  }

  async getRecentActivities(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const facultyId = httpRequest.user?.userId || httpRequest.params?.facultyId;
    if (!facultyId) {
      return this.httpErrors.error_400("Faculty ID is required");
    }
    const params: GetFacultyRecentActivitiesRequestDTO = { facultyId };
    const result = await this.getFacultyRecentActivitiesUseCase.execute(params);
    if (result.success) {
      return this.httpSuccess.success_200((result.data as GetFacultyRecentActivitiesResponseDTO).recentActivities);
    } else {
      return this.httpErrors.error_400((result.data as ErrorResponse)?.error || "Failed to fetch recent activities");
    }
  }

} 