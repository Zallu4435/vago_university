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
export interface GetRecentActivitiesResponseDTO {
  recentAdmissions: any[];
  recentPayments: any[];
  recentEnquiries: any[];
  recentNotifications: any[];
}
export interface GetSystemAlertsResponseDTO {
  pendingAdmissions: number;
  pendingFinancialAid: number;
  failedPayments: number;
  overdueCharges: number;
  completedPayments: number;
}
export type RefreshDashboardResponseDTO = DashboardData;

export interface DismissAlertResponseDTO {
  success: boolean;
  message: string;
}

export interface MarkActivityAsReadResponseDTO {
  success: boolean;
  message: string;
} 