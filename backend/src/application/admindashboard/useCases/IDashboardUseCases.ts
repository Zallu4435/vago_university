import {
  GetDashboardDataRequestDTO,
  GetDashboardMetricsRequestDTO,
  GetUserGrowthDataRequestDTO,
  GetRevenueDataRequestDTO,
  GetPerformanceDataRequestDTO,
  GetRecentActivitiesRequestDTO,
  GetSystemAlertsRequestDTO,
  RefreshDashboardRequestDTO,
} from "../../../domain/admindashboard/dtos/DashboardRequestDTOs";
import {
  GetDashboardDataResponseDTO,
  GetDashboardMetricsResponseDTO,
  GetUserGrowthDataResponseDTO,
  GetRevenueDataResponseDTO,
  GetRecentActivitiesResponseDTO,
  GetSystemAlertsResponseDTO,
  ResponseDTO
} from "../../../domain/admindashboard/dtos/DashboardResponseDTOs";
import { PerformanceData, DashboardDataRaw } from '../../../domain/admindashboard/entities/AdminDashboardTypes';

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
  execute(params: GetPerformanceDataRequestDTO): Promise<ResponseDTO<PerformanceData[]>>;
}

export interface IGetRecentActivitiesUseCase {
  execute(params: GetRecentActivitiesRequestDTO): Promise<ResponseDTO<GetRecentActivitiesResponseDTO>>;
}

export interface IGetSystemAlertsUseCase {
  execute(params: GetSystemAlertsRequestDTO): Promise<ResponseDTO<GetSystemAlertsResponseDTO>>;
}

export interface IRefreshDashboardUseCase {
  execute(params: RefreshDashboardRequestDTO): Promise<ResponseDTO<DashboardDataRaw>>;
}
