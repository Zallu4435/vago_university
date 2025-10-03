import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IFacultyDashboardController } from '../IHttp';
import {
  IGetFacultyDashboardStatsUseCase,
  IGetFacultyDashboardDataUseCase,
  IGetFacultyWeeklyAttendanceUseCase,
  IGetFacultyCoursePerformanceUseCase,
  IGetFacultySessionDistributionUseCase,
  IGetFacultyRecentActivitiesUseCase,
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

interface ErrorResponse {
  error: string;
  message?: string;
  [key: string]: unknown;
}

export class FacultyDashboardController implements IFacultyDashboardController {
  private _httpErrors: HttpErrors;
  private _httpSuccess: HttpSuccess;

  constructor(
    private _getFacultyDashboardStatsUseCase: IGetFacultyDashboardStatsUseCase,
    private _getFacultyDashboardDataUseCase: IGetFacultyDashboardDataUseCase,
    private _getFacultyWeeklyAttendanceUseCase: IGetFacultyWeeklyAttendanceUseCase,
    private _getFacultyCoursePerformanceUseCase: IGetFacultyCoursePerformanceUseCase,
    private _getFacultySessionDistributionUseCase: IGetFacultySessionDistributionUseCase,
    private _getFacultyRecentActivitiesUseCase: IGetFacultyRecentActivitiesUseCase
  ) {
    this._httpErrors = new HttpErrors();
    this._httpSuccess = new HttpSuccess();
  }

  async getDashboardStats(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const facultyId = httpRequest.user?.userId || httpRequest.params?.facultyId;
    if (!facultyId) {
      return this._httpErrors.error_400("Faculty ID is required");
    }
    const params: GetFacultyDashboardStatsRequestDTO = { facultyId };
    const result = await this._getFacultyDashboardStatsUseCase.execute(params);
    if (result.success) {
      return this._httpSuccess.success_200((result.data as GetFacultyDashboardStatsResponseDTO).stats);
    } else {
      return this._httpErrors.error_400((result.data as ErrorResponse)?.error || "Failed to fetch dashboard stats");
    }
  }

  async getDashboardData(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const facultyId = httpRequest.user?.userId || httpRequest.params?.facultyId;
    if (!facultyId) {
      return this._httpErrors.error_400("Faculty ID is required");
    }
    const params: GetFacultyDashboardDataRequestDTO = { facultyId };
    const result = await this._getFacultyDashboardDataUseCase.execute(params);
    if (result.success) {
      return this._httpSuccess.success_200((result.data as GetFacultyDashboardDataResponseDTO).dashboardData);
    } else {
      return this._httpErrors.error_400((result.data as ErrorResponse)?.error || "Failed to fetch dashboard data");
    }
  }

  async getWeeklyAttendance(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const facultyId = httpRequest.user?.userId || httpRequest.params?.facultyId;
    if (!facultyId) {
      return this._httpErrors.error_400("Faculty ID is required");
    }
    const params: GetFacultyWeeklyAttendanceRequestDTO = { facultyId };
    const result = await this._getFacultyWeeklyAttendanceUseCase.execute(params);
    if (result.success) {
      return this._httpSuccess.success_200((result.data as GetFacultyWeeklyAttendanceResponseDTO).weeklyAttendance);
    } else {
      return this._httpErrors.error_400((result.data as ErrorResponse)?.error || "Failed to fetch weekly attendance");
    }
  }

  async getCoursePerformance(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const facultyId = httpRequest.user?.userId || httpRequest.params?.facultyId;
    if (!facultyId) {
      return this._httpErrors.error_400("Faculty ID is required");
    }
    const params: GetFacultyCoursePerformanceRequestDTO = { facultyId };
    const result = await this._getFacultyCoursePerformanceUseCase.execute(params);
    if (result.success) {
      return this._httpSuccess.success_200((result.data as GetFacultyCoursePerformanceResponseDTO).assignmentPerformance);
    } else {
      return this._httpErrors.error_400((result.data as ErrorResponse)?.error || "Failed to fetch assignment performance");
    }
  }

  async getSessionDistribution(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const facultyId = httpRequest.user?.userId || httpRequest.params?.facultyId;
    if (!facultyId) {
      return this._httpErrors.error_400("Faculty ID is required");
    }
    const params: GetFacultySessionDistributionRequestDTO = { facultyId };
    const result = await this._getFacultySessionDistributionUseCase.execute(params);
    if (result.success) {
      return this._httpSuccess.success_200((result.data as GetFacultySessionDistributionResponseDTO).sessionDistribution);
    } else {
      return this._httpErrors.error_400((result.data as ErrorResponse)?.error || "Failed to fetch session distribution");
    }
  }

  async getRecentActivities(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const facultyId = httpRequest.user?.userId || httpRequest.params?.facultyId;
    if (!facultyId) {
      return this._httpErrors.error_400("Faculty ID is required");
    }
    const params: GetFacultyRecentActivitiesRequestDTO = { facultyId };
    const result = await this._getFacultyRecentActivitiesUseCase.execute(params);
    if (result.success) {
      return this._httpSuccess.success_200((result.data as GetFacultyRecentActivitiesResponseDTO).recentActivities);
    } else {
      return this._httpErrors.error_400((result.data as ErrorResponse)?.error || "Failed to fetch recent activities");
    }
  }

} 