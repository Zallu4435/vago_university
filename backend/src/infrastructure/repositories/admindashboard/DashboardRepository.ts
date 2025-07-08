import mongoose from 'mongoose';
import { IDashboardRepository } from '../../../application/admindashboard/repositories/IDashboardRepository';
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
} from '../../../domain/admindashboard/dtos/DashboardRequestDTOs';
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
  DashboardMetrics,
  UserGrowthData,
  RevenueData,
  PerformanceData,
  ActivityItem,
  SystemAlert,
  DashboardData,
} from '../../../domain/admindashboard/dtos/DashboardResponseDTOs';

// Import correct models
import { User } from '../../database/mongoose/auth/user.model';
import { CourseModel } from '../../database/mongoose/models/courses/CourseModel';
import { Admission } from '../../database/mongoose/admission/AdmissionModel';
import { Payment } from '../../database/mongoose/models/payment.model';
import { Faculty } from '../../database/mongoose/auth/faculty.model';
import { PaymentModel } from '../../database/mongoose/models/financial.model';
import { StudentFinancialInfoModel } from '../../database/mongoose/models/financial.model';
import { ChargeModel } from '../../database/mongoose/models/financial.model';
import { FinancialAidApplicationModel } from '../../database/mongoose/models/financial.model';
import { ScholarshipApplicationModel } from '../../database/mongoose/models/financial.model';
import { Enquiry } from '../../database/mongoose/models/enquiry.model';
import { NotificationModel } from '../../database/mongoose/models/notification.model';
import { MessageModel } from '../../database/mongoose/models/communication.model';
import { Video } from '../../database/mongoose/models/video.model';
import { TeamModel } from '../../database/mongoose/models/sports.model';
import { Diploma } from '../../database/mongoose/models/diploma.model';
import { CampusEventModel } from '../../database/mongoose/models/events/CampusEventModel';
import { ClubModel } from '../../database/mongoose/models/clubs/ClubModel';

export class DashboardRepository implements IDashboardRepository {
  async getDashboardData(params: GetDashboardDataRequestDTO): Promise<any> {
    // Only fetch raw data from the database or other repositories, no business logic or mapping
    const [
      metricsRaw,
      userGrowthRaw,
      revenueRaw,
      performanceRaw,
      activitiesRaw,
      alertsRaw
    ] = await Promise.all([
        this.getDashboardMetrics({}),
        this.getUserGrowthData({}),
        this.getRevenueData({}),
        this.getPerformanceData({}),
        this.getRecentActivities({}),
        this.getSystemAlerts({}),
      ]);
    return {
      metricsRaw,
      userGrowthRaw,
      revenueRaw,
      performanceRaw,
      activitiesRaw,
      alertsRaw
    };
  }

  async getDashboardMetrics(params: GetDashboardMetricsRequestDTO): Promise<any> {
    // Only fetch raw data from the database
      const [totalUsers, totalFaculty, totalCourses, pendingAdmissions, completedPayments, pendingFinancialAid] = await Promise.all([
        User.countDocuments({}),
        Faculty.countDocuments({}),
        CourseModel.countDocuments({}),
        Admission.countDocuments({ status: 'pending' }),
        PaymentModel.aggregate([
          { $match: { status: 'Completed' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        FinancialAidApplicationModel.countDocuments({ status: 'Pending' }),
      ]);
    return {
      totalUsers,
      totalFaculty,
      totalCourses,
      pendingAdmissions,
      completedPayments,
      pendingFinancialAid
    };
  }

  async getUserGrowthData(params: GetUserGrowthDataRequestDTO): Promise<any> {
    // Only fetch raw user and faculty registration data for the last 6 months
      const { period = 'monthly', startDate, endDate } = params;
      const end = endDate ? new Date(endDate) : new Date();
      const start = startDate ? new Date(startDate) : new Date(end.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const userGrowthRaw: any[] = [];
      for (let i = 0; i < 6; i++) {
        const date = new Date(start.getTime() + i * 30 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const usersCount = await User.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } });
      const facultyCount = await Faculty.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } });
      userGrowthRaw.push({
          month: months[date.getMonth()],
        usersCount,
        facultyCount
      });
    }
    return userGrowthRaw;
  }

  async getRevenueData(params: GetRevenueDataRequestDTO): Promise<any> {
    // Only fetch raw payment data for the last 6 months
      const { period = 'monthly', startDate, endDate } = params;
      const end = endDate ? new Date(endDate) : new Date();
      const start = startDate ? new Date(startDate) : new Date(end.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueRaw: any[] = [];
      for (let i = 0; i < 6; i++) {
        const date = new Date(start.getTime() + i * 30 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const payments = await PaymentModel.aggregate([
          {
            $match: {
              status: 'Completed',
              date: { $gte: monthStart, $lte: monthEnd },
            },
          },
          {
            $group: {
              _id: '$method',
              total: { $sum: '$amount' },
            },
          },
        ]);
      revenueRaw.push({
          month: months[date.getMonth()],
        payments
      });
    }
    return revenueRaw;
  }

  async getPerformanceData(params: GetPerformanceDataRequestDTO): Promise<any> {
    // Only fetch raw counts for all relevant collections
      const [
        userCount,
        facultyCount,
        courseCount,
        admissionCount,
        paymentCount,
        enquiryCount,
        notificationCount,
        communicationCount,
        financialAidCount,
        scholarshipCount,
        videoCount,
        sportsCount,
        diplomaCount,
        eventsCount,
      clubsCount
      ] = await Promise.all([
        User.countDocuments({}),
        Faculty.countDocuments({}),
        CourseModel.countDocuments({}),
        Admission.countDocuments({}),
        PaymentModel.countDocuments({ status: 'Completed' }),
        Enquiry.countDocuments({}),
        NotificationModel.countDocuments({}),
        MessageModel.countDocuments({}),
        FinancialAidApplicationModel.countDocuments({}),
        ScholarshipApplicationModel.countDocuments({}),
        Video.countDocuments({}),
        TeamModel.countDocuments({}),
        Diploma.countDocuments({}),
        CampusEventModel.countDocuments({}),
        ClubModel.countDocuments({}),
    ]);
    return {
      userCount,
      facultyCount,
      courseCount,
      admissionCount,
      paymentCount,
      enquiryCount,
      notificationCount,
      communicationCount,
      financialAidCount,
      scholarshipCount,
      videoCount,
      sportsCount,
      diplomaCount,
      eventsCount,
      clubsCount
    };
  }

  async getRecentActivities(params: GetRecentActivitiesRequestDTO): Promise<any> {
    // Only fetch raw recent admissions, payments, enquiries, notifications
      const [recentAdmissions, recentPayments, recentEnquiries, recentNotifications] = await Promise.all([
      Admission.find({}).sort({ createdAt: -1 }).limit(3).populate('registerId', 'firstName lastName email'),
      PaymentModel.find({ status: 'Completed' }).sort({ date: -1 }).limit(3).populate('studentId', 'firstName lastName email'),
      Enquiry.find({}).sort({ createdAt: -1 }).limit(3),
      NotificationModel.find({}).sort({ createdAt: -1 }).limit(3),
    ]);
    return {
      recentAdmissions,
      recentPayments,
      recentEnquiries,
      recentNotifications
    };
  }

  async getSystemAlerts(params: GetSystemAlertsRequestDTO): Promise<any> {
    // Only fetch raw counts for alerts
    const [pendingAdmissions, pendingFinancialAid, failedPayments, overdueCharges, completedPayments] = await Promise.all([
        Admission.countDocuments({ status: 'pending' }),
        FinancialAidApplicationModel.countDocuments({ status: 'Pending' }),
        PaymentModel.countDocuments({ status: 'Failed' }),
      StudentFinancialInfoModel.countDocuments({ status: 'Pending', paymentDueDate: { $lt: new Date() } }),
      PaymentModel.countDocuments({ status: 'Completed' }),
    ]);
    return {
      pendingAdmissions,
      pendingFinancialAid,
      failedPayments,
      overdueCharges,
      completedPayments
    };
  }

  async refreshDashboard(params: RefreshDashboardRequestDTO): Promise<any> {
    // Just call getDashboardData for fresh raw data
      return await this.getDashboardData({});
  }

  async dismissAlert(params: DismissAlertRequestDTO): Promise<any> {
    // Just return the alertId for now
    return { alertId: params.alertId };
  }

  async markActivityAsRead(params: MarkActivityAsReadRequestDTO): Promise<any> {
    // Just return the activityId for now
    return { activityId: params.activityId };
  }

  // Helper methods
  private getTimeAgo(date: Date | string): string {
    const now = new Date();
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
} 