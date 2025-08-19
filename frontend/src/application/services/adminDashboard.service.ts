import { ActivityItem, ApiResponse, DashboardData, DashboardMetrics, PerformanceData, RevenueData, SystemAlert, UserGrowthData } from '../../domain/types/dashboard/admin';
import httpClient from '../../frameworks/api/httpClient';
import { isAxiosErrorWithApiError } from '../../shared/types/apiError';

class AdminDashboardService {
  async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await httpClient.get<ApiResponse<DashboardData>>('/admin/dashboard');
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch dashboard data');
      }
      throw new Error('Failed to fetch dashboard data');
    }
  }

  async getMetrics(): Promise<DashboardMetrics> {
    try {
      const response = await httpClient.get<ApiResponse<DashboardMetrics>>('/admin/dashboard/metrics');
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch metrics');
      }
      throw new Error('Failed to fetch metrics');
    }
  }

  async getUserGrowthData(): Promise<UserGrowthData[]> {
    try {
      const response = await httpClient.get<ApiResponse<UserGrowthData[]>>('/admin/dashboard/user-growth');
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch user growth data');
      }
      throw new Error('Failed to fetch user growth data');
    }
  }

  async getRevenueData(): Promise<RevenueData[]> {
    try {
      const response = await httpClient.get<ApiResponse<RevenueData[]>>('/admin/dashboard/revenue');
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch revenue data');
      }
      throw new Error('Failed to fetch revenue data');
    }
  }

  async getPerformanceData(): Promise<PerformanceData[]> {
    try {
      const response = await httpClient.get<ApiResponse<PerformanceData[]>>('/admin/dashboard/performance');
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch performance data');
      }
      throw new Error('Failed to fetch performance data');
    }
  }

  async getRecentActivities(): Promise<ActivityItem[]> {
    try {
      const response = await httpClient.get<ApiResponse<ActivityItem[]>>('/admin/dashboard/activities');
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch recent activities');
      }
      throw new Error('Failed to fetch recent activities');
    }
  }

  async getSystemAlerts(): Promise<SystemAlert[]> {
    try {
      const response = await httpClient.get<ApiResponse<SystemAlert[]>>('/admin/dashboard/alerts');
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch system alerts');
      }
      throw new Error('Failed to fetch system alerts');
    }
  }

  async refreshDashboard(): Promise<DashboardData> {
    try {
      const response = await httpClient.post<ApiResponse<DashboardData>>('/admin/dashboard/refresh');
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to refresh dashboard');
      }
      throw new Error('Failed to refresh dashboard');
    }
  }

  async dismissAlert(alertId: string): Promise<void> {
    try {
      await httpClient.patch(`/admin/dashboard/alerts/${alertId}/dismiss`);
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to dismiss alert');
      }
      throw new Error('Failed to dismiss alert');
    }
  }
}

export const adminDashboardService = new AdminDashboardService(); 