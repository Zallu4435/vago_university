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
} from "../../../application/admindashboard/useCases/DashboardUseCases";

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
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async getDashboardData(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const response = await this.getDashboardDataUseCase.execute({});
    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(response.data);
  }

  async getDashboardMetrics(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const response = await this.getDashboardMetricsUseCase.execute({});
    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(response.data);
  }

  async getUserGrowthData(httpRequest: IHttpRequest): Promise<IHttpResponse> {
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
  }

  async getRevenueData(httpRequest: IHttpRequest): Promise<IHttpResponse> {
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
  }

  async getPerformanceData(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const response = await this.getPerformanceDataUseCase.execute({});
    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(response.data);
  }

  async getRecentActivities(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { limit, type } = httpRequest.query || {};
    const response = await this.getRecentActivitiesUseCase.execute({
      limit: limit ? Number(limit) : undefined,
      type: type ? String(type) as 'all' | 'success' | 'warning' | 'info' | 'error' : undefined,
    });
    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(response.data);
  }

  async getSystemAlerts(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { priority, type } = httpRequest.query || {};
    const response = await this.getSystemAlertsUseCase.execute({
      priority: priority ? String(priority) as 'all' | 'low' | 'medium' | 'high' : undefined,
      type: type ? String(type) as 'all' | 'success' | 'warning' | 'error' | 'info' : undefined,
    });
    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(response.data);
  }

  async refreshDashboard(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const response = await this.refreshDashboardUseCase.execute({});
    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(response.data);
  }

} 