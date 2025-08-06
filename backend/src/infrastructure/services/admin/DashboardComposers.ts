import { AdminDashboardController } from '../../../presentation/http/admindashboard/DashboardController';
import {
  GetDashboardDataUseCase,
  GetDashboardMetricsUseCase,
  GetUserGrowthDataUseCase,
  GetRevenueDataUseCase,
  GetPerformanceDataUseCase,
  GetRecentActivitiesUseCase,
  GetSystemAlertsUseCase,
  RefreshDashboardUseCase,
} from '../../../application/admindashboard/useCases/DashboardUseCases';
import { DashboardRepository } from '../../repositories/admindashboard/DashboardRepository';

export function getAdminDashboardComposer() {
  const dashboardRepository = new DashboardRepository();

  const getDashboardDataUseCase = new GetDashboardDataUseCase(dashboardRepository);
  const getDashboardMetricsUseCase = new GetDashboardMetricsUseCase(dashboardRepository);
  const getUserGrowthDataUseCase = new GetUserGrowthDataUseCase(dashboardRepository);
  const getRevenueDataUseCase = new GetRevenueDataUseCase(dashboardRepository);
  const getPerformanceDataUseCase = new GetPerformanceDataUseCase(dashboardRepository);
  const getRecentActivitiesUseCase = new GetRecentActivitiesUseCase(dashboardRepository);
  const getSystemAlertsUseCase = new GetSystemAlertsUseCase(dashboardRepository);
  const refreshDashboardUseCase = new RefreshDashboardUseCase(dashboardRepository);

  const adminDashboardController = new AdminDashboardController(
    getDashboardDataUseCase,
    getDashboardMetricsUseCase,
    getUserGrowthDataUseCase,
    getRevenueDataUseCase,
    getPerformanceDataUseCase,
    getRecentActivitiesUseCase,
    getSystemAlertsUseCase,
    refreshDashboardUseCase,
  );

  return {
    adminDashboardController,
  };
} 