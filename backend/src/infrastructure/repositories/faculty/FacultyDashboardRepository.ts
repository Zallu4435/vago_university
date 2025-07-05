import mongoose from "mongoose";
import { IFacultyDashboardRepository } from "../../../application/faculty/dashboard/repositories/IFacultyDashboardRepository";
import {
  GetFacultyDashboardStatsRequestDTO,
  GetFacultyDashboardDataRequestDTO,
  GetFacultyWeeklyAttendanceRequestDTO,
  GetFacultyCoursePerformanceRequestDTO,
  GetFacultySessionDistributionRequestDTO,
  GetFacultyRecentActivitiesRequestDTO,
  GetFacultySystemStatusRequestDTO,
} from "../../../domain/faculty/dashboard/dtos/FacultyDashboardRequestDTOs";
import {
  GetFacultyDashboardStatsResponseDTO,
  GetFacultyDashboardDataResponseDTO,
  GetFacultyWeeklyAttendanceResponseDTO,
  GetFacultyCoursePerformanceResponseDTO,
  GetFacultySessionDistributionResponseDTO,
  GetFacultyRecentActivitiesResponseDTO,
  GetFacultySystemStatusResponseDTO,
} from "../../../domain/faculty/dashboard/dtos/FacultyDashboardResponseDTOs";
import { VideoSessionModel } from "../../database/mongoose/models/session.model";
import { User } from "../../database/mongoose/models/user.model";
import { CourseModel } from "../../database/mongoose/models/courses/CourseModel";

export class FacultyDashboardRepository implements IFacultyDashboardRepository {
  async getDashboardStats(params: GetFacultyDashboardStatsRequestDTO): Promise<GetFacultyDashboardStatsResponseDTO> {
    if (!mongoose.isValidObjectId(params.facultyId)) {
      throw new Error("Invalid faculty ID");
    }

    console.log('🔍 FacultyDashboardRepository - getDashboardStats');
    console.log('Faculty ID:', params.facultyId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get active sessions (sessions that are currently running or scheduled for today)
    const activeSessions = await VideoSessionModel.countDocuments({
      hostId: params.facultyId,
      status: { $ne: "Ended" },
      startTime: { $lte: new Date() },
      endTime: { $gte: new Date() }
    });

    console.log('Active sessions found:', activeSessions);

    // Get today's attendance
    const todayAttendance = await VideoSessionModel.aggregate([
      {
        $match: {
          hostId: params.facultyId,
          startTime: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $unwind: "$attendance"
      },
      {
        $group: {
          _id: null,
          totalAttendance: { $sum: 1 }
        }
      }
    ]);

    console.log('Today attendance aggregation result:', todayAttendance);

    // Get pending approvals (attendance records that need faculty approval)
    const pendingApprovals = await VideoSessionModel.aggregate([
      {
        $match: {
          hostId: params.facultyId,
          "attendance.status": { $in: ["pending", null] }
        }
      },
      {
        $unwind: "$attendance"
      },
      {
        $match: {
          "attendance.status": { $in: ["pending", null] }
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('Pending approvals aggregation result:', pendingApprovals);

    // Get total students (unique students who have attended any session)
    const totalStudents = await VideoSessionModel.aggregate([
      {
        $match: {
          hostId: params.facultyId
        }
      },
      {
        $unwind: "$attendance"
      },
      {
        $group: {
          _id: "$attendance.userId"
        }
      },
      {
        $count: "total"
      }
    ]);

    console.log('Total students aggregation result:', totalStudents);

    // Let's also check what sessions exist for this faculty
    const allSessions = await VideoSessionModel.find({ hostId: params.facultyId }).lean();
    console.log('All sessions for faculty:', allSessions.length);
    console.log('Sample session:', allSessions[0]);

    // Let's check ALL sessions in the database to see what exists
    const allSessionsInDB = await VideoSessionModel.find({}).limit(5).lean();
    console.log('Total sessions in database:', await VideoSessionModel.countDocuments({}));
    console.log('Sample sessions from database:', allSessionsInDB);

    // Let's also check if there are sessions with different faculty identifiers
    const sessionsWithHostId = await VideoSessionModel.find({ hostId: { $exists: true } }).limit(5).lean();
    console.log('Sessions with hostId field:', sessionsWithHostId.length);
    console.log('Sample sessions with hostId:', sessionsWithHostId);

    // Let's check if there are sessions with facultyId field instead
    const sessionsWithFacultyId = await VideoSessionModel.find({ facultyId: { $exists: true } }).limit(5).lean();
    console.log('Sessions with facultyId field:', sessionsWithFacultyId.length);
    console.log('Sample sessions with facultyId:', sessionsWithFacultyId);

    return {
      stats: {
        activeSessions,
        todayAttendance: todayAttendance[0]?.totalAttendance || 0,
        pendingApprovals: pendingApprovals[0]?.count || 0,
        totalStudents: totalStudents[0]?.total || 0
      }
    };
  }

  async getDashboardData(params: GetFacultyDashboardDataRequestDTO): Promise<GetFacultyDashboardDataResponseDTO> {
    const [stats, weeklyAttendance, coursePerformance, sessionDistribution, recentActivities, systemStatus] = await Promise.all([
      this.getDashboardStats(params),
      this.getWeeklyAttendance(params),
      this.getCoursePerformance(params),
      this.getSessionDistribution(params),
      this.getRecentActivities(params),
      this.getSystemStatus(params)
    ]);

    return {
      dashboardData: {
        stats: stats.stats,
        weeklyAttendance: weeklyAttendance.weeklyAttendance,
        coursePerformance: coursePerformance.coursePerformance,
        sessionDistribution: sessionDistribution.sessionDistribution,
        recentActivities: recentActivities.recentActivities,
        systemStatus: systemStatus.systemStatus
      }
    };
  }

  async getWeeklyAttendance(params: GetFacultyWeeklyAttendanceRequestDTO): Promise<GetFacultyWeeklyAttendanceResponseDTO> {
    if (!mongoose.isValidObjectId(params.facultyId)) {
      throw new Error("Invalid faculty ID");
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weeklyData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const attendance = await VideoSessionModel.aggregate([
        {
          $match: {
            hostId: params.facultyId,
            startTime: { $gte: dayStart, $lte: dayEnd }
          }
        },
        {
          $unwind: "$attendance"
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 }
          }
        }
      ]);

      weeklyData.push({
        day: days[date.getDay()],
        attendance: attendance[0]?.count || 0
      });
    }

    return { weeklyAttendance: weeklyData };
  }

  async getCoursePerformance(params: GetFacultyCoursePerformanceRequestDTO): Promise<GetFacultyCoursePerformanceResponseDTO> {
    if (!mongoose.isValidObjectId(params.facultyId)) {
      throw new Error("Invalid faculty ID");
    }

    // Get courses taught by this faculty
    const courses = await CourseModel.find({ faculty: params.facultyId }).lean();

    const coursePerformance = await Promise.all(
      courses.map(async (course) => {
        // Calculate average attendance for this course
        const sessions = await VideoSessionModel.find({ 
          hostId: params.facultyId,
          course: course.title 
        }).lean();

        let totalAttendance = 0;
        let totalSessions = sessions.length;

        sessions.forEach(session => {
          if (session.attendance) {
            totalAttendance += session.attendance.length;
          }
        });

        const averageAttendance = totalSessions > 0 ? Math.round((totalAttendance / totalSessions) * 100) : 0;

        return {
          course: course.title || 'Unknown Course',
          score: averageAttendance
        };
      })
    );

    return { coursePerformance };
  }

  async getSessionDistribution(params: GetFacultySessionDistributionRequestDTO): Promise<GetFacultySessionDistributionResponseDTO> {
    if (!mongoose.isValidObjectId(params.facultyId)) {
      throw new Error("Invalid faculty ID");
    }

    const sessionTypes = await VideoSessionModel.aggregate([
      {
        $match: {
          hostId: params.facultyId
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    
    const sessionDistribution = sessionTypes.map((type, index) => ({
      name: type._id || 'Unknown',
      value: type.count,
      color: colors[index % colors.length]
    }));

    return { sessionDistribution };
  }

  async getRecentActivities(params: GetFacultyRecentActivitiesRequestDTO): Promise<GetFacultyRecentActivitiesResponseDTO> {
    if (!mongoose.isValidObjectId(params.facultyId)) {
      throw new Error("Invalid faculty ID");
    }

    const recentActivities = [];

    // Get recent sessions
    const recentSessions = await VideoSessionModel.find({ hostId: params.facultyId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    recentSessions.forEach(session => {
      recentActivities.push({
        id: session._id.toString(),
        type: 'attendance' as const,
        message: `Session "${session.title}" ${session.status === 'ended' ? 'ended' : 'started'}`,
        time: session.createdAt.toISOString()
      });
    });

    // Note: Assignment model doesn't exist, so we'll skip assignment activities for now
    // In a real implementation, you would create the Assignment model or use an alternative

    // Sort by time and take the most recent 10
    recentActivities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    recentActivities.splice(10);

    return { recentActivities };
  }

  async getSystemStatus(params: GetFacultySystemStatusRequestDTO): Promise<GetFacultySystemStatusResponseDTO> {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Mock system status - in a real implementation, you'd check actual system metrics
    const systemStatus = {
      serverStatus: 'online' as const,
      database: dbStatus as 'connected' | 'disconnected',
      lastBackup: new Date().toISOString() // Mock backup time
    };

    return { systemStatus };
  }
} 