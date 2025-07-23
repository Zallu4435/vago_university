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
import { IDashboardRepository } from "../repositories/IDashboardRepository";
import { PerformanceRawData, PerformanceData } from '../../../domain/admindashboard/entities/AdminDashboardTypes';
import {
  DashboardDataNotFoundError,
  DashboardMetricsError,
  DashboardUserGrowthError,
  DashboardRevenueError,
  DashboardPerformanceError,
  DashboardActivitiesError,
  DashboardAlertsError,
  DashboardDismissAlertError,
  DashboardMarkActivityError
} from '../../../domain/admindashboard/errors/DashboardErrors';

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
  execute(params: GetPerformanceDataRequestDTO): Promise<ResponseDTO<PerformanceData[]>>;
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
    const raw: any = await this.dashboardRepository.getDashboardData(params);
    if (!raw || !raw.metricsRaw || !raw.userGrowthRaw || !raw.revenueRaw || !raw.performanceRaw || !raw.activitiesRaw || !raw.alertsRaw) {
      throw new DashboardDataNotFoundError();
    }
    const dashboardData = {
      metrics: raw.metricsRaw.data,
      userGrowth: raw.userGrowthRaw.data,
      revenue: raw.revenueRaw.data,
      performance: raw.performanceRaw.data,
      activities: raw.activitiesRaw.data,
      alerts: raw.alertsRaw.data,
    };
    return { data: dashboardData, success: true };
  }
}

export class GetDashboardMetricsUseCase implements IGetDashboardMetricsUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(params: GetDashboardMetricsRequestDTO): Promise<ResponseDTO<GetDashboardMetricsResponseDTO>> {
    const raw: any = await this.dashboardRepository.getDashboardMetrics(params);
    if (!raw || !Array.isArray(raw.completedPayments)) {
      throw new DashboardMetricsError();
    }
    const totalRevenue = raw.completedPayments[0]?.total || 0;
    const metrics = {
      totalUsers: raw.totalUsers + raw.totalFaculty,
      totalRevenue,
      activeCourses: raw.totalCourses,
      pendingApprovals: raw.pendingAdmissions + raw.pendingFinancialAid,
    };
    return { data: metrics, success: true };
  }
}

export class GetUserGrowthDataUseCase implements IGetUserGrowthDataUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(params: GetUserGrowthDataRequestDTO): Promise<ResponseDTO<GetUserGrowthDataResponseDTO>> {
    const raw: any = await this.dashboardRepository.getUserGrowthData(params);
    if (!raw || !Array.isArray(raw) || raw.length === 0) {
      throw new DashboardUserGrowthError();
    }
    let cumulativeUsers = 0;
    const userGrowth = raw.map((item: any, i: number) => {
      const users = item.usersCount + item.facultyCount;
      cumulativeUsers += users;
      const target = Math.floor(cumulativeUsers * 1.1) + 2;
      return {
        month: item.month,
        users: cumulativeUsers,
        target,
      };
    });
    return { data: userGrowth, success: true };
  }
}

export class GetRevenueDataUseCase implements IGetRevenueDataUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(params: GetRevenueDataRequestDTO): Promise<ResponseDTO<GetRevenueDataResponseDTO>> {
    const raw = await this.dashboardRepository.getRevenueData(params);
    if (!raw || !Array.isArray(raw) || raw.length === 0) {
      throw new DashboardRevenueError();
    }
    const revenue = raw.map((item: any) => {
      let tuition = 0, fees = 0, other = 0;
      item.payments.forEach((p: any) => {
        if (p._id === 'Credit Card' || p._id === 'Bank Transfer') tuition += p.total;
        else if (p._id === 'Razorpay' || p._id === 'stripe') fees += p.total;
        else if (p._id === 'Financial Aid') other += p.total;
      });
      return {
        month: item.month,
        tuition,
        fees,
        other,
      };
    });
    return { data: revenue, success: true };
  }
}

export class GetPerformanceDataUseCase implements IGetPerformanceDataUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(params: GetPerformanceDataRequestDTO): Promise<ResponseDTO<PerformanceData[]>> {
    const raw: PerformanceRawData = await this.dashboardRepository.getPerformanceData(params);
    if (!raw) {
      throw new DashboardPerformanceError();
    } 
    const performance = [
      { name: 'User Management', value: Math.round(70 + (raw.userCount * 2)), color: '#6366F1' },
      { name: 'Faculty Management', value: Math.round(70 + (raw.facultyCount * 3)), color: '#10B981' },
      { name: 'Course Management', value: Math.round(70 + (raw.courseCount * 4)), color: '#F59E0B' },
      { name: 'Admission Management', value: Math.round(70 + (raw.admissionCount * 1.5)), color: '#EF4444' },
      { name: 'Payment Management', value: Math.round(70 + (raw.paymentCount * 2.5)), color: '#8B5CF6' },
      { name: 'Enquiry Management', value: Math.round(70 + (raw.enquiryCount * 2)), color: '#06B6D4' },
      { name: 'Notification Management', value: Math.round(70 + (raw.notificationCount * 3)), color: '#EC4899' },
      { name: 'Communication Management', value: Math.round(70 + (raw.communicationCount * 4)), color: '#F97316' },
      { name: 'Financial Aid Management', value: Math.round(70 + (raw.financialAidCount * 2.5)), color: '#84CC16' },
      { name: 'Video Management', value: Math.round(70 + (raw.videoCount * 4)), color: '#F472B6' },
      { name: 'Sports Management', value: Math.round(70 + (raw.sportsCount * 5)), color: '#22D3EE' },
      { name: 'Diploma Management', value: Math.round(70 + (raw.diplomaCount * 6)), color: '#A78BFA' },
      { name: 'Events Management', value: Math.round(70 + (raw.eventsCount * 4.5)), color: '#FB7185' },
      { name: 'Clubs Management', value: Math.round(70 + (raw.clubsCount * 2)), color: '#FBBF24' },
    ];
    return { data: performance, success: true };
  }
}

export class GetRecentActivitiesUseCase implements IGetRecentActivitiesUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(params: GetRecentActivitiesRequestDTO): Promise<ResponseDTO<GetRecentActivitiesResponseDTO>> {
    const raw = await this.dashboardRepository.getRecentActivities(params);
    if (!raw || !raw.recentAdmissions || !raw.recentPayments || !raw.recentEnquiries || !raw.recentNotifications) {
      throw new DashboardActivitiesError();
    }
    const activities: any[] = [];
    raw.recentAdmissions.forEach((admission: any) => {
      const fullName = admission.personal?.fullName || (admission.registerId?.firstName + ' ' + admission.registerId?.lastName) || 'Unknown';
      activities.push({
        id: admission._id.toString(),
        action: `Admission ${admission.status || 'pending'}: ${fullName}`,
        user: fullName,
        time: '',
        avatar: '',
        type: admission.status === 'approved' ? 'success' : admission.status === 'rejected' ? 'warning' : 'info',
        isRead: false,
      });
    });
    raw.recentPayments.forEach((payment: any) => {
      const studentName = payment.studentId?.firstName && payment.studentId?.lastName 
        ? `${payment.studentId.firstName} ${payment.studentId.lastName}`
        : 'Unknown Student';
      activities.push({
        id: payment._id.toString(),
        action: `Payment received: $${payment.amount || 0} via ${payment.method || 'Unknown method'}`,
        user: studentName,
        time: '',
        avatar: '',
        type: 'success',
        isRead: false,
      });
    });
    raw.recentEnquiries.forEach((enquiry: any) => {
      const enquiryName = enquiry.name || 'Anonymous';
      activities.push({
        id: enquiry._id.toString(),
        action: `New enquiry: ${enquiry.subject || 'General enquiry'}`,
        user: enquiryName,
        time: '',
        avatar: '',
        type: 'info',
        isRead: false,
      });
    });
    raw.recentNotifications.forEach((notification: any) => {
      activities.push({
        id: notification._id.toString(),
        action: `Notification sent: ${notification.title || 'System notification'}`,
        user: 'System',
        time: '',
        avatar: 'SY',
        type: 'info',
        isRead: false,
      });
    });
    return { data: {
      recentAdmissions: activities.slice(0, 5),
      recentPayments: activities.slice(0, 5),
      recentEnquiries: activities.slice(0, 5),
      recentNotifications: activities.slice(0, 5),
    }, success: true };
  }
}

export class GetSystemAlertsUseCase implements IGetSystemAlertsUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(params: GetSystemAlertsRequestDTO): Promise<ResponseDTO<GetSystemAlertsResponseDTO>> {
    const raw = await this.dashboardRepository.getSystemAlerts(params);
    if (!raw) {
      throw new DashboardAlertsError();
    }
    const alerts: any[] = [];
    if (raw.pendingAdmissions > 0) {
      alerts.push({
        id: '1',
        title: `${raw.pendingAdmissions} admission applications pending`,
        message: 'Requires immediate attention',
        type: 'warning',
        priority: raw.pendingAdmissions > 10 ? 'high' : 'medium',
        timestamp: new Date().toISOString(),
        isDismissed: false,
      });
    }
    if (raw.pendingFinancialAid > 0) {
      alerts.push({
        id: '2',
        title: `${raw.pendingFinancialAid} financial aid applications pending`,
        message: 'Review required',
        type: 'info',
        priority: 'medium',
        timestamp: new Date().toISOString(),
        isDismissed: false,
      });
    }
    if (raw.failedPayments > 0) {
      alerts.push({
        id: '3',
        title: `${raw.failedPayments} payment failures detected`,
        message: 'Follow-up required',
        type: 'error',
        priority: 'high',
        timestamp: new Date().toISOString(),
        isDismissed: false,
      });
    }
    if (raw.overdueCharges > 0) {
      alerts.push({
        id: '4',
        title: `${raw.overdueCharges} overdue charges detected`,
        message: 'Payment collection required',
        type: 'error',
        priority: 'high',
        timestamp: new Date().toISOString(),
        isDismissed: false,
      });
    }
    if (raw.completedPayments > 0) {
      alerts.push({
        id: '5',
        title: `${raw.completedPayments} payments processed successfully`,
        message: 'System operating normally',
        type: 'success',
        priority: 'low',
        timestamp: new Date().toISOString(),
        isDismissed: false,
      });
    }
    return { data: alerts, success: true };
  }
}

export class RefreshDashboardUseCase implements IRefreshDashboardUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(params: RefreshDashboardRequestDTO): Promise<ResponseDTO<RefreshDashboardResponseDTO>> {
    const raw = await this.dashboardRepository.refreshDashboard(params);
    if (!raw) {
      throw new DashboardDataNotFoundError();
    }
    return { data: raw, success: true };
  }
}

export class DismissAlertUseCase implements IDismissAlertUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(params: DismissAlertRequestDTO): Promise<ResponseDTO<DismissAlertResponseDTO>> {
    const raw = await this.dashboardRepository.dismissAlert(params);
    if (!raw || !raw.alertId) {
      throw new DashboardDismissAlertError();
    }
    return { data: { success: true, message: `Alert ${raw.alertId} dismissed successfully` }, success: true };
  }
}

export class MarkActivityAsReadUseCase implements IMarkActivityAsReadUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(params: MarkActivityAsReadRequestDTO): Promise<ResponseDTO<MarkActivityAsReadResponseDTO>> {
    const raw = await this.dashboardRepository.markActivityAsRead(params);
    if (!raw || !raw.activityId) {
      throw new DashboardMarkActivityError();
    }
    return { data: { success: true, message: `Activity ${raw.activityId} marked as read successfully` }, success: true };
  }
} 