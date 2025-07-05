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
} from "../../../domain/admin/dtos/DashboardRequestDTOs";
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
} from "../../../domain/admin/dtos/DashboardResponseDTOs";
import { IDashboardRepository } from "../repositories/IDashboardRepository";

interface ResponseDTO<T> {
  data: T | { error: string };
  success: boolean;
}

export interface IGetDashboardDataUseCase {
  execute(params: GetDashboardDataRequestDTO): Promise<ResponseDTO<GetDashboardDataResponseDTO>>;
}

export interface IGetDashboardMetricsUseCase {
  execute(params: GetDashboardMetricsRequestDTO): Promise<ResponseDTO<GetDashboardMetricsResponseDTO>>;
}

export interface IGetUserGrowthDataUseCase {
  execute(params: GetUserGrowthDataRequestDTO): Promise<ResponseDTO<GetUserGrowthDataResponseDTO>>;
}

export interface IGetRevenueDataUseCase {
  execute(params: GetRevenueDataRequestDTO): Promise<ResponseDTO<GetRevenueDataResponseDTO>>;
}

export interface IGetPerformanceDataUseCase {
  execute(params: GetPerformanceDataRequestDTO): Promise<ResponseDTO<GetPerformanceDataResponseDTO>>;
}

export interface IGetRecentActivitiesUseCase {
  execute(params: GetRecentActivitiesRequestDTO): Promise<ResponseDTO<GetRecentActivitiesResponseDTO>>;
}

export interface IGetSystemAlertsUseCase {
  execute(params: GetSystemAlertsRequestDTO): Promise<ResponseDTO<GetSystemAlertsResponseDTO>>;
}

export interface IRefreshDashboardUseCase {
  execute(params: RefreshDashboardRequestDTO): Promise<ResponseDTO<RefreshDashboardResponseDTO>>;
}

export interface IDismissAlertUseCase {
  execute(params: DismissAlertRequestDTO): Promise<ResponseDTO<DismissAlertResponseDTO>>;
}

export interface IMarkActivityAsReadUseCase {
  execute(params: MarkActivityAsReadRequestDTO): Promise<ResponseDTO<MarkActivityAsReadResponseDTO>>;
}

export class GetDashboardDataUseCase implements IGetDashboardDataUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(params: GetDashboardDataRequestDTO): Promise<ResponseDTO<GetDashboardDataResponseDTO>> {
    try {
      const result = await this.dashboardRepository.getDashboardData(params);
      return { data: result, success: true };
    } catch (error: any) {
      console.error("GetDashboardDataUseCase: Error:", error);
      return { data: { error: error.message || "Failed to fetch dashboard data" }, success: false };
    }
  }
}

export class GetDashboardMetricsUseCase implements IGetDashboardMetricsUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(params: GetDashboardMetricsRequestDTO): Promise<ResponseDTO<GetDashboardMetricsResponseDTO>> {
    try {
      const result = await this.dashboardRepository.getDashboardMetrics(params);
      return { data: result, success: true };
    } catch (error: any) {
      console.error("GetDashboardMetricsUseCase: Error:", error);
      return { data: { error: error.message || "Failed to fetch dashboard metrics" }, success: false };
    }
  }
}

export class GetUserGrowthDataUseCase implements IGetUserGrowthDataUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(params: GetUserGrowthDataRequestDTO): Promise<ResponseDTO<GetUserGrowthDataResponseDTO>> {
    try {
      const result = await this.dashboardRepository.getUserGrowthData(params);
      return { data: result, success: true };
    } catch (error: any) {
      console.error("GetUserGrowthDataUseCase: Error:", error);
      return { data: { error: error.message || "Failed to fetch user growth data" }, success: false };
    }
  }
}

export class GetRevenueDataUseCase implements IGetRevenueDataUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(params: GetRevenueDataRequestDTO): Promise<ResponseDTO<GetRevenueDataResponseDTO>> {
    try {
      const result = await this.dashboardRepository.getRevenueData(params);
      return { data: result, success: true };
    } catch (error: any) {
      console.error("GetRevenueDataUseCase: Error:", error);
      return { data: { error: error.message || "Failed to fetch revenue data" }, success: false };
    }
  }
}

export class GetPerformanceDataUseCase implements IGetPerformanceDataUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(params: GetPerformanceDataRequestDTO): Promise<ResponseDTO<GetPerformanceDataResponseDTO>> {
    try {
      const result = await this.dashboardRepository.getPerformanceData(params);
      return { data: result, success: true };
    } catch (error: any) {
      console.error("GetPerformanceDataUseCase: Error:", error);
      return { data: { error: error.message || "Failed to fetch performance data" }, success: false };
    }
  }
}

export class GetRecentActivitiesUseCase implements IGetRecentActivitiesUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(params: GetRecentActivitiesRequestDTO): Promise<ResponseDTO<GetRecentActivitiesResponseDTO>> {
    try {
      const result = await this.dashboardRepository.getRecentActivities(params);
      return { data: result, success: true };
    } catch (error: any) {
      console.error("GetRecentActivitiesUseCase: Error:", error);
      return { data: { error: error.message || "Failed to fetch recent activities" }, success: false };
    }
  }
}

export class GetSystemAlertsUseCase implements IGetSystemAlertsUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(params: GetSystemAlertsRequestDTO): Promise<ResponseDTO<GetSystemAlertsResponseDTO>> {
    try {
      const result = await this.dashboardRepository.getSystemAlerts(params);
      return { data: result, success: true };
    } catch (error: any) {
      console.error("GetSystemAlertsUseCase: Error:", error);
      return { data: { error: error.message || "Failed to fetch system alerts" }, success: false };
    }
  }
}

export class RefreshDashboardUseCase implements IRefreshDashboardUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(params: RefreshDashboardRequestDTO): Promise<ResponseDTO<RefreshDashboardResponseDTO>> {
    try {
      const result = await this.dashboardRepository.refreshDashboard(params);
      return { data: result, success: true };
    } catch (error: any) {
      console.error("RefreshDashboardUseCase: Error:", error);
      return { data: { error: error.message || "Failed to refresh dashboard" }, success: false };
    }
  }
}

export class DismissAlertUseCase implements IDismissAlertUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(params: DismissAlertRequestDTO): Promise<ResponseDTO<DismissAlertResponseDTO>> {
    try {
      const result = await this.dashboardRepository.dismissAlert(params);
      return { data: result, success: true };
    } catch (error: any) {
      console.error("DismissAlertUseCase: Error:", error);
      return { data: { error: error.message || "Failed to dismiss alert" }, success: false };
    }
  }
}

export class MarkActivityAsReadUseCase implements IMarkActivityAsReadUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(params: MarkActivityAsReadRequestDTO): Promise<ResponseDTO<MarkActivityAsReadResponseDTO>> {
    try {
      const result = await this.dashboardRepository.markActivityAsRead(params);
      return { data: result, success: true };
    } catch (error: any) {
      console.error("MarkActivityAsReadUseCase: Error:", error);
      return { data: { error: error.message || "Failed to mark activity as read" }, success: false };
    }
  }
} 