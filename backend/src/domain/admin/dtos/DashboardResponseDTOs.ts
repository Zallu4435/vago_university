export interface DashboardMetrics {
  totalUsers: number;
  totalRevenue: number;
  activeCourses: number;
  pendingApprovals: number;
}

export interface UserGrowthData {
  month: string;
  users: number;
  target: number;
}

export interface RevenueData {
  month: string;
  tuition: number;
  fees: number;
  other: number;
}

export interface PerformanceData {
  name: string;
  value: number;
  color: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  user: string;
  time: string;
  avatar: string;
  type: 'success' | 'warning' | 'info' | 'default';
  isRead: boolean;
}

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  isDismissed: boolean;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  userGrowth: UserGrowthData[];
  revenue: RevenueData[];
  performance: PerformanceData[];
  activities: ActivityItem[];
  alerts: SystemAlert[];
}

export interface GetDashboardDataResponseDTO {
  data: DashboardData;
}

export interface GetDashboardMetricsResponseDTO {
  data: DashboardMetrics;
}

export interface GetUserGrowthDataResponseDTO {
  data: UserGrowthData[];
}

export interface GetRevenueDataResponseDTO {
  data: RevenueData[];
}

export interface GetPerformanceDataResponseDTO {
  data: PerformanceData[];
}

export interface GetRecentActivitiesResponseDTO {
  data: ActivityItem[];
}

export interface GetSystemAlertsResponseDTO {
  data: SystemAlert[];
}

export interface RefreshDashboardResponseDTO {
  data: DashboardData;
}

export interface DismissAlertResponseDTO {
  success: boolean;
  message: string;
}

export interface MarkActivityAsReadResponseDTO {
  success: boolean;
  message: string;
} 