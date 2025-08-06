import {
  DashboardMetrics,
  UserGrowthData,
  RevenueData,
  PerformanceData,
  ActivityItem,
  SystemAlert,
  DashboardData
} from '../entities/AdminDashboardTypes';

export type GetDashboardDataResponseDTO = DashboardData;
export type GetDashboardMetricsResponseDTO = DashboardMetrics;
export type GetUserGrowthDataResponseDTO = UserGrowthData[];
export type GetRevenueDataResponseDTO = RevenueData[];
export type GetPerformanceDataResponseDTO = PerformanceData[];
export type GetRecentActivitiesResponseDTO = ActivityItem[];
export type GetSystemAlertsResponseDTO = SystemAlert[];
export type RefreshDashboardResponseDTO = DashboardData;

export interface DismissAlertResponseDTO {
  success: boolean;
  message: string;
}

export interface MarkActivityAsReadResponseDTO {
  success: boolean;
  message: string;
} 