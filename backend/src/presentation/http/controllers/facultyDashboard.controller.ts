import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IFacultyDashboardController } from '../IHttp';
import {
  GetFacultyDashboardStatsUseCase,
  GetFacultyDashboardDataUseCase,
  GetFacultyWeeklyAttendanceUseCase,
  GetFacultyCoursePerformanceUseCase,
  GetFacultySessionDistributionUseCase,
  GetFacultyRecentActivitiesUseCase,
  GetFacultySystemStatusUseCase,
} from "../../../application/faculty/dashboard/useCases/FacultyDashboardUseCases";
import {
  GetFacultyDashboardStatsRequestDTO,
  GetFacultyDashboardDataRequestDTO,
  GetFacultyWeeklyAttendanceRequestDTO,
  GetFacultyCoursePerformanceRequestDTO,
  GetFacultySessionDistributionRequestDTO,
  GetFacultyRecentActivitiesRequestDTO,
  GetFacultySystemStatusRequestDTO,
} from "../../../domain/faculty/dashboard/dtos/FacultyDashboardRequestDTOs";

export class FacultyDashboardController implements IFacultyDashboardController {
  private httpErrors: HttpErrors;
  private httpSuccess: HttpSuccess;

  constructor(
    private getFacultyDashboardStatsUseCase: GetFacultyDashboardStatsUseCase,
    private getFacultyDashboardDataUseCase: GetFacultyDashboardDataUseCase,
    private getFacultyWeeklyAttendanceUseCase: GetFacultyWeeklyAttendanceUseCase,
    private getFacultyCoursePerformanceUseCase: GetFacultyCoursePerformanceUseCase,
    private getFacultySessionDistributionUseCase: GetFacultySessionDistributionUseCase,
    private getFacultyRecentActivitiesUseCase: GetFacultyRecentActivitiesUseCase,
    private getFacultySystemStatusUseCase: GetFacultySystemStatusUseCase
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async getDashboardStats(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const facultyId = httpRequest.user?.id || httpRequest.params?.facultyId;
      
      if (!facultyId) {
        return this.httpErrors.error_400("Faculty ID is required");
      }

      const params: GetFacultyDashboardStatsRequestDTO = { facultyId };
      const result = await this.getFacultyDashboardStatsUseCase.execute(params);

      if (result.success) {
        return this.httpSuccess.success_200((result.data as any).stats);
      } else {
        return this.httpErrors.error_400((result.data as any)?.error || "Failed to fetch dashboard stats");
      }
    } catch (error: any) {
      return this.httpErrors.error_500(error.message, error.stack);
    }
  }

  async getDashboardData(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const facultyId = httpRequest.user?.id || httpRequest.params?.facultyId;
      
      if (!facultyId) {
        return this.httpErrors.error_400("Faculty ID is required");
      }

      const params: GetFacultyDashboardDataRequestDTO = { facultyId };
      const result = await this.getFacultyDashboardDataUseCase.execute(params);

      if (result.success) {
        return this.httpSuccess.success_200((result.data as any).dashboardData);
      } else {
        return this.httpErrors.error_400((result.data as any)?.error || "Failed to fetch dashboard data");
      }
    } catch (error: any) {
      return this.httpErrors.error_500(error.message, error.stack);
    }
  }

  async getWeeklyAttendance(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const facultyId = httpRequest.user?.id || httpRequest.params?.facultyId;
      
      if (!facultyId) {
        return this.httpErrors.error_400("Faculty ID is required");
      }

      const params: GetFacultyWeeklyAttendanceRequestDTO = { facultyId };
      const result = await this.getFacultyWeeklyAttendanceUseCase.execute(params);

      if (result.success) {
        return this.httpSuccess.success_200((result.data as any).weeklyAttendance);
      } else {
        return this.httpErrors.error_400((result.data as any)?.error || "Failed to fetch weekly attendance");
      }
    } catch (error: any) {
      return this.httpErrors.error_500(error.message, error.stack);
    }
  }

  async getCoursePerformance(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const facultyId = httpRequest.user?.id || httpRequest.params?.facultyId;
      
      if (!facultyId) {
        return this.httpErrors.error_400("Faculty ID is required");
      }

      const params: GetFacultyCoursePerformanceRequestDTO = { facultyId };
      const result = await this.getFacultyCoursePerformanceUseCase.execute(params);

      if (result.success) {
        return this.httpSuccess.success_200((result.data as any).coursePerformance);
      } else {
        return this.httpErrors.error_400((result.data as any)?.error || "Failed to fetch course performance");
      }
    } catch (error: any) {
      return this.httpErrors.error_500(error.message, error.stack);
    }
  }

  async getSessionDistribution(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const facultyId = httpRequest.user?.id || httpRequest.params?.facultyId;
      
      if (!facultyId) {
        return this.httpErrors.error_400("Faculty ID is required");
      }

      const params: GetFacultySessionDistributionRequestDTO = { facultyId };
      const result = await this.getFacultySessionDistributionUseCase.execute(params);

      if (result.success) {
        return this.httpSuccess.success_200((result.data as any).sessionDistribution);
      } else {
        return this.httpErrors.error_400((result.data as any)?.error || "Failed to fetch session distribution");
      }
    } catch (error: any) {
      return this.httpErrors.error_500(error.message, error.stack);
    }
  }

  async getRecentActivities(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const facultyId = httpRequest.user?.id || httpRequest.params?.facultyId;
      
      if (!facultyId) {
        return this.httpErrors.error_400("Faculty ID is required");
      }

      const params: GetFacultyRecentActivitiesRequestDTO = { facultyId };
      const result = await this.getFacultyRecentActivitiesUseCase.execute(params);

      if (result.success) {
        return this.httpSuccess.success_200((result.data as any).recentActivities);
      } else {
        return this.httpErrors.error_400((result.data as any)?.error || "Failed to fetch recent activities");
      }
    } catch (error: any) {
      return this.httpErrors.error_500(error.message, error.stack);
    }
  }

  async getSystemStatus(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const params: GetFacultySystemStatusRequestDTO = {};
      const result = await this.getFacultySystemStatusUseCase.execute(params);

      if (result.success) {
        return this.httpSuccess.success_200((result.data as any).systemStatus);
      } else {
        return this.httpErrors.error_400((result.data as any)?.error || "Failed to fetch system status");
      }
    } catch (error: any) {
      return this.httpErrors.error_500(error.message, error.stack);
    }
  }
} 