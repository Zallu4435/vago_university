import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IAdminDashboardController } from "../IHttp";
import {
  GetDashboardDataUseCase,
  GetDashboardMetricsUseCase,
  GetUserGrowthDataUseCase,
  GetRevenueDataUseCase,
  GetPerformanceDataUseCase,
  GetRecentActivitiesUseCase,
  GetSystemAlertsUseCase,
  RefreshDashboardUseCase,
  DismissAlertUseCase,
  MarkActivityAsReadUseCase,
} from "../../../application/admin/useCases/DashboardUseCases";

export class AdminDashboardController implements IAdminDashboardController {
  private httpErrors: HttpErrors;
  private httpSuccess: HttpSuccess;

  constructor(
    private getDashboardDataUseCase: GetDashboardDataUseCase,
    private getDashboardMetricsUseCase: GetDashboardMetricsUseCase,
    private getUserGrowthDataUseCase: GetUserGrowthDataUseCase,
    private getRevenueDataUseCase: GetRevenueDataUseCase,
    private getPerformanceDataUseCase: GetPerformanceDataUseCase,
    private getRecentActivitiesUseCase: GetRecentActivitiesUseCase,
    private getSystemAlertsUseCase: GetSystemAlertsUseCase,
    private refreshDashboardUseCase: RefreshDashboardUseCase,
    private dismissAlertUseCase: DismissAlertUseCase,
    private markActivityAsReadUseCase: MarkActivityAsReadUseCase
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async getDashboardData(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const response = await this.getDashboardDataUseCase.execute({});
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async getDashboardMetrics(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const response = await this.getDashboardMetricsUseCase.execute({});
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async getUserGrowthData(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { period, startDate, endDate } = httpRequest.query || {};
      const response = await this.getUserGrowthDataUseCase.execute({
        period: period ? String(period) as 'monthly' | 'quarterly' | 'yearly' : undefined,
        startDate: startDate ? String(startDate) : undefined,
        endDate: endDate ? String(endDate) : undefined,
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async getRevenueData(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { period, startDate, endDate } = httpRequest.query || {};
      const response = await this.getRevenueDataUseCase.execute({
        period: period ? String(period) as 'monthly' | 'quarterly' | 'yearly' : undefined,
        startDate: startDate ? String(startDate) : undefined,
        endDate: endDate ? String(endDate) : undefined,
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async getPerformanceData(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const response = await this.getPerformanceDataUseCase.execute({});
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async getRecentActivities(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { limit, type } = httpRequest.query || {};
      const response = await this.getRecentActivitiesUseCase.execute({
        limit: limit ? Number(limit) : undefined,
        type: type ? String(type) as 'all' | 'success' | 'warning' | 'info' | 'error' : undefined,
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async getSystemAlerts(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { priority, type } = httpRequest.query || {};
      const response = await this.getSystemAlertsUseCase.execute({
        priority: priority ? String(priority) as 'all' | 'low' | 'medium' | 'high' : undefined,
        type: type ? String(type) as 'all' | 'success' | 'warning' | 'error' | 'info' : undefined,
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async refreshDashboard(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const response = await this.refreshDashboardUseCase.execute({});
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async dismissAlert(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { alertId } = httpRequest.params || {};
      if (!alertId) {
        return this.httpErrors.error_400();
      }
      const response = await this.dismissAlertUseCase.execute({ alertId });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async markActivityAsRead(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { activityId } = httpRequest.params || {};
      if (!activityId) {
        return this.httpErrors.error_400();
      }
      const response = await this.markActivityAsReadUseCase.execute({ activityId });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }
} 