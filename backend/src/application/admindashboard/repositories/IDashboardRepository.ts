import {
  GetDashboardDataRequestDTO,
  GetDashboardMetricsRequestDTO,
  GetUserGrowthDataRequestDTO,
  GetRevenueDataRequestDTO,
  GetPerformanceDataRequestDTO,
  GetRecentActivitiesRequestDTO,
  GetSystemAlertsRequestDTO,
  RefreshDashboardRequestDTO,
  DismissAlertRequestDTO,
  MarkActivityAsReadRequestDTO,
} from "../../../domain/admindashboard/dtos/DashboardRequestDTOs";
import {
  GetDashboardDataResponseDTO,
  GetDashboardMetricsResponseDTO,
  GetUserGrowthDataResponseDTO,
  GetRevenueDataResponseDTO,
  GetPerformanceDataResponseDTO,
  GetRecentActivitiesResponseDTO,
  GetSystemAlertsResponseDTO,
  RefreshDashboardResponseDTO,
  DismissAlertResponseDTO,
  MarkActivityAsReadResponseDTO,
} from "../../../domain/admindashboard/dtos/DashboardResponseDTOs";

export interface IDashboardRepository {
  getDashboardData(params: GetDashboardDataRequestDTO): Promise<GetDashboardDataResponseDTO>;
  getDashboardMetrics(params: GetDashboardMetricsRequestDTO): Promise<GetDashboardMetricsResponseDTO>;
  getUserGrowthData(params: GetUserGrowthDataRequestDTO): Promise<GetUserGrowthDataResponseDTO>;
  getRevenueData(params: GetRevenueDataRequestDTO): Promise<GetRevenueDataResponseDTO>;
  getPerformanceData(params: GetPerformanceDataRequestDTO): Promise<GetPerformanceDataResponseDTO>;
  getRecentActivities(params: GetRecentActivitiesRequestDTO): Promise<GetRecentActivitiesResponseDTO>;
  getSystemAlerts(params: GetSystemAlertsRequestDTO): Promise<GetSystemAlertsResponseDTO>;
  refreshDashboard(params: RefreshDashboardRequestDTO): Promise<RefreshDashboardResponseDTO>;
  dismissAlert(params: DismissAlertRequestDTO): Promise<DismissAlertResponseDTO>;
  markActivityAsRead(params: MarkActivityAsReadRequestDTO): Promise<MarkActivityAsReadResponseDTO>;
} 