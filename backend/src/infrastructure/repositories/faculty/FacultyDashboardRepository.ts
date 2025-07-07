import mongoose from "mongoose";
import { IFacultyDashboardRepository } from "../../../application/faculty/dashboard/repositories/IFacultyDashboardRepository";
import {
  GetFacultyDashboardStatsRequestDTO,
  GetFacultyDashboardDataRequestDTO,
  GetFacultyWeeklyAttendanceRequestDTO,
  GetFacultyCoursePerformanceRequestDTO,
  GetFacultySessionDistributionRequestDTO,
  GetFacultyRecentActivitiesRequestDTO,
} from "../../../domain/faculty/dashboard/dtos/FacultyDashboardRequestDTOs";
import {
  GetFacultyDashboardStatsResponseDTO,
  GetFacultyDashboardDataResponseDTO,
  GetFacultyWeeklyAttendanceResponseDTO,
  GetFacultyCoursePerformanceResponseDTO,
  GetFacultySessionDistributionResponseDTO,
  GetFacultyRecentActivitiesResponseDTO,
} from "../../../domain/faculty/dashboard/dtos/FacultyDashboardResponseDTOs";
import { VideoSessionModel } from "../../database/mongoose/models/session.model";
import { User } from "../../database/mongoose/models/user.model";
import { CourseModel } from "../../database/mongoose/models/courses/CourseModel";

export class FacultyDashboardRepository implements IFacultyDashboardRepository {
  async getDashboardStats(params: GetFacultyDashboardStatsRequestDTO): Promise<GetFacultyDashboardStatsResponseDTO> {
    if (!mongoose.isValidObjectId(params.facultyId)) {
      throw new Error("Invalid faculty ID");
    }

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

    // Get today's attendance percentage
    const todaySessions = await VideoSessionModel.find({
      hostId: params.facultyId,
      startTime: { $gte: today, $lt: tomorrow }
    }).lean();

    let totalExpectedAttendance = 0;
    let totalActualAttendance = 0;

    todaySessions.forEach(session => {
      if (session.maxAttendees) {
        totalExpectedAttendance += session.maxAttendees;
      }
      if (session.attendance && Array.isArray(session.attendance)) {
        // Only count attendance records with approved status
        const approvedAttendance = session.attendance.filter((a: any) => 
          a.status === 'approved' || a.status === 'approve'
        );
        totalActualAttendance += approvedAttendance.length;
      }
    });

    const todayAttendancePercentage = totalExpectedAttendance > 0 
      ? Math.round((totalActualAttendance / totalExpectedAttendance) * 100) 
      : 0;

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

    return {
      stats: {
        activeSessions,
        todayAttendance: todayAttendancePercentage,
        pendingApprovals: pendingApprovals[0]?.count || 0,
        totalStudents: totalStudents[0]?.total || 0
      }
    };
  }

  async getDashboardData(params: GetFacultyDashboardDataRequestDTO): Promise<GetFacultyDashboardDataResponseDTO> {
    const [stats, weeklyAttendance, coursePerformance, sessionDistribution, recentActivities] = await Promise.all([
      this.getDashboardStats(params),
      this.getWeeklyAttendance(params),
      this.getCoursePerformance(params),
      this.getSessionDistribution(params),
      this.getRecentActivities(params)
    ]);

    return {
      dashboardData: {
        stats: stats.stats,
        weeklyAttendance: weeklyAttendance.weeklyAttendance,
        coursePerformance: coursePerformance.coursePerformance,
        sessionDistribution: sessionDistribution.sessionDistribution,
        recentActivities: recentActivities.recentActivities
      }
    };
  }

  async getWeeklyAttendance(params: GetFacultyWeeklyAttendanceRequestDTO): Promise<GetFacultyWeeklyAttendanceResponseDTO> {
    console.log('🔍 [FacultyDashboardRepository] getWeeklyAttendance called with params:', params);
    
    if (!mongoose.isValidObjectId(params.facultyId)) {
      console.error('❌ [FacultyDashboardRepository] Invalid faculty ID:', params.facultyId);
      throw new Error("Invalid faculty ID");
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weeklyData = [];

    console.log('📅 [FacultyDashboardRepository] Starting weekly attendance calculation...');

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      console.log(`📅 [FacultyDashboardRepository] Processing day ${i}: ${days[date.getDay()]} (${dayStart.toISOString()} to ${dayEnd.toISOString()})`);

      // Get sessions for this day
      const daySessions = await VideoSessionModel.find({
        hostId: params.facultyId,
        startTime: { $gte: dayStart, $lte: dayEnd }
      }).lean();

      console.log(`📊 [FacultyDashboardRepository] Found ${daySessions.length} sessions for ${days[date.getDay()]}:`, daySessions);

      let totalExpectedAttendance = 0;
      let totalActualAttendance = 0;

      daySessions.forEach(session => {
        if (session.maxAttendees) {
          totalExpectedAttendance += session.maxAttendees;
        }
        if (session.attendance && Array.isArray(session.attendance)) {
          // Only count attendance records with approved status
          const approvedAttendance = session.attendance.filter((a: any) => 
            a.status === 'approved' || a.status === 'approve'
          );
          totalActualAttendance += approvedAttendance.length;
        }
      });

      const attendancePercentage = totalExpectedAttendance > 0 
        ? Math.round((totalActualAttendance / totalExpectedAttendance) * 100) 
        : 0;

      console.log(`📊 [FacultyDashboardRepository] ${days[date.getDay()]} - Expected: ${totalExpectedAttendance}, Actual: ${totalActualAttendance}, Percentage: ${attendancePercentage}%`);

      weeklyData.push({
        day: days[date.getDay()],
        attendance: attendancePercentage
      });
    }

    console.log('📊 [FacultyDashboardRepository] Final weekly data:', weeklyData);
    console.log('📊 [FacultyDashboardRepository] Returning response:', { weeklyAttendance: weeklyData });

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
        // Calculate average attendance percentage for this course
        const sessions = await VideoSessionModel.find({ 
          hostId: params.facultyId,
          course: course.title 
        }).lean();

        let totalExpectedAttendance = 0;
        let totalActualAttendance = 0;

        sessions.forEach(session => {
          if (session.maxAttendees) {
            totalExpectedAttendance += session.maxAttendees;
          }
          if (session.attendance && Array.isArray(session.attendance)) {
            // Only count attendance records with approved status
            const approvedAttendance = session.attendance.filter((a: any) => 
              a.status === 'approved' || a.status === 'approve'
            );
            totalActualAttendance += approvedAttendance.length;
          }
        });

        const averageAttendancePercentage = totalExpectedAttendance > 0 
          ? Math.round((totalActualAttendance / totalExpectedAttendance) * 100) 
          : 0;

        return {
          course: course.title || 'Unknown Course',
          score: averageAttendancePercentage
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

    // Get recent sessions with more detailed information
    const recentSessions = await VideoSessionModel.find({ hostId: params.facultyId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    recentSessions.forEach(session => {
      let message = '';
      let type: 'attendance' | 'assignment' | 'announcement' | 'system' = 'attendance';

      if (session.status === 'Ended') {
        message = `Session "${session.title}" ended with ${session.attendance?.length || 0} attendees`;
      } else if (session.status === 'Ongoing') {
        message = `Session "${session.title}" is currently active`;
      } else if (session.status === 'Scheduled') {
        message = `Session "${session.title}" scheduled for ${new Date(session.startTime).toLocaleDateString()}`;
      } else {
        message = `Session "${session.title}" ${session.status}`;
      }

      recentActivities.push({
        id: session._id.toString(),
        type,
        message,
        time: session.createdAt.toISOString()
      });
    });

    // Get recent course activities (if courses were recently created/updated)
    const recentCourses = await CourseModel.find({ faculty: params.facultyId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean();

    recentCourses.forEach(course => {
      recentActivities.push({
        id: course._id.toString(),
        type: 'announcement' as const,
        message: `Course "${course.title}" was updated`,
        time: course.updatedAt.toISOString()
      });
    });

    // Sort by time and take the most recent 10
    recentActivities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    recentActivities.splice(10);

    return { recentActivities };
  }


} 