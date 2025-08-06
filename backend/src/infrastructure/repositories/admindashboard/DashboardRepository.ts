import { IDashboardRepository } from '../../../application/admindashboard/repositories/IDashboardRepository';
import { User } from '../../database/mongoose/auth/user.model';
import { CourseModel } from '../../database/mongoose/models/courses/CourseModel';
import { Admission } from '../../database/mongoose/admission/AdmissionModel';
import { Faculty } from '../../database/mongoose/auth/faculty.model';
import { PaymentModel } from '../../database/mongoose/models/financial.model';
import { StudentFinancialInfoModel } from '../../database/mongoose/models/financial.model';
import { Enquiry } from '../../database/mongoose/models/enquiry.model';
import { NotificationModel } from '../../database/mongoose/models/notification.model';
import { MessageModel } from '../../database/mongoose/models/communication.model';
import { Video } from '../../database/mongoose/models/video.model';
import { TeamModel } from '../../database/mongoose/models/sports.model';
import { Diploma } from '../../database/mongoose/models/diploma.model';
import { CampusEventModel } from '../../database/mongoose/models/events/CampusEventModel';
import { ClubModel } from '../../database/mongoose/models/clubs/ClubModel';
import { PerformanceRawData } from '../../../domain/admindashboard/entities/AdminDashboardTypes';

export class DashboardRepository implements IDashboardRepository {
  async getDashboardData() {
    const [
      metricsRaw,
      userGrowthRaw,
      revenueRaw,
      performanceRaw,
      activitiesRaw,
      alertsRaw
    ] = await Promise.all([
      this.getDashboardMetrics(),
      this.getUserGrowthData(),
      this.getRevenueData(),
      this.getPerformanceData(),
      this.getRecentActivities(),
      this.getSystemAlerts(),
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

  async getDashboardMetrics() {
    const [totalUsers, totalFaculty, totalCourses, pendingAdmissions, completedPayments] = await Promise.all([
      User.countDocuments({}),
      Faculty.countDocuments({}),
      CourseModel.countDocuments({}),
      Admission.countDocuments({ status: { $regex: '^pending$', $options: 'i' } }),
      PaymentModel.aggregate([
        { $match: { status: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);
    return {
      totalUsers,
      totalFaculty,
      totalCourses,
      pendingAdmissions,
      completedPayments
    };
  }

  async getUserGrowthData() {
    const end = new Date();
    const start = new Date(end.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
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

  async getRevenueData() {
    const end = new Date();
    const start = new Date(end.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
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

  async getPerformanceData(): Promise<PerformanceRawData> {
    const [
      userCount,
      facultyCount,
      courseCount,
      admissionCount,
      paymentCount,
      enquiryCount,
      notificationCount,
      communicationCount,
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
      videoCount,
      sportsCount,
      diplomaCount,
      eventsCount,
      clubsCount
    };
  }

  async getRecentActivities() {
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

  async getSystemAlerts() {
    const [pendingAdmissions, failedPayments, overdueCharges, completedPayments] = await Promise.all([
      Admission.countDocuments({ status: 'pending' }),
      PaymentModel.countDocuments({ status: 'Failed' }),
      StudentFinancialInfoModel.countDocuments({ status: 'Pending', paymentDueDate: { $lt: new Date() } }),
      PaymentModel.countDocuments({ status: 'Completed' }),
    ]);
    return {
      pendingAdmissions,
      failedPayments,
      overdueCharges,
      completedPayments
    };
  }

  async refreshDashboard() {
    return await this.getDashboardData();
  }
 

} 