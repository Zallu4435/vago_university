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
import { CourseModel } from "../../database/mongoose/models/courses/CourseModel";
import { AssignmentModel } from "../../database/mongoose/assignment/AssignmentModel";

export class FacultyDashboardRepository implements IFacultyDashboardRepository {
  async getDashboardStats(params: GetFacultyDashboardStatsRequestDTO): Promise<GetFacultyDashboardStatsResponseDTO> {
    if (!mongoose.isValidObjectId(params.facultyId)) {
      throw new Error("Invalid faculty ID");
    }

    const totalSessions = await VideoSessionModel.countDocuments({
      hostId: params.facultyId
    });

    const totalAssignments = await AssignmentModel.countDocuments();

    const totalAttendance = await VideoSessionModel.aggregate([
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
          _id: null,
          count: { $sum: 1 }
        }
      }
    ]);

    return {
      stats: {
        totalSessions,
        totalAssignments,
        totalAttendance: totalAttendance[0]?.count || 0
      }
    };
  }

  async getDashboardData(params: GetFacultyDashboardDataRequestDTO): Promise<GetFacultyDashboardDataResponseDTO> {
    const [stats, weeklyAttendance, assignmentPerformance, sessionDistribution, recentActivities] = await Promise.all([
      this.getDashboardStats(params),
      this.getWeeklyAttendance(params),
      this.getAssignmentPerformance(params),
      this.getSessionDistribution(params),
      this.getRecentActivities(params)
    ]);

    return {
      dashboardData: {
        stats: stats.stats,
        weeklyAttendance: weeklyAttendance.weeklyAttendance,
        assignmentPerformance: assignmentPerformance.assignmentPerformance,
        sessionDistribution: sessionDistribution.sessionDistribution,
        recentActivities: recentActivities.recentActivities
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

      const daySessions = await VideoSessionModel.find({
        hostId: params.facultyId,
        startTime: { $gte: dayStart, $lte: dayEnd }
      }).lean();

      let totalExpectedAttendance = 0;
      let totalActualAttendance = 0;

      daySessions.forEach(session => {
        if (session.maxAttendees) {
          totalExpectedAttendance += session.maxAttendees;
        }
        if (session.attendance && Array.isArray(session.attendance)) {
          const actualAttendance = session.attendance.filter((a) =>
            a.intervals && Array.isArray(a.intervals) && a.intervals.length > 0
          );
          totalActualAttendance += actualAttendance.length;
        }
      });

      const attendancePercentage = totalExpectedAttendance > 0
        ? Math.round((totalActualAttendance / totalExpectedAttendance) * 100)
        : 0;

      weeklyData.push({
        day: days[date.getDay()],
        attendance: attendancePercentage
      });
    }

    return { weeklyAttendance: weeklyData };
  }

  async getAssignmentPerformance(params: GetFacultyCoursePerformanceRequestDTO): Promise<GetFacultyCoursePerformanceResponseDTO> {
    if (!mongoose.isValidObjectId(params.facultyId)) {
      throw new Error("Invalid faculty ID");
    }

    const assignmentPerformance = await AssignmentModel.aggregate([
      {
        $match: {
          status: { $in: ['published', 'active'] }
        }
      },
      {
        $lookup: {
          from: 'usersubmissions',
          localField: '_id',
          foreignField: 'assignmentId',
          as: 'submissions'
        }
      },
      {
        $addFields: {
          totalSubmissions: { $size: '$submissions' },
          averageScore: {
            $cond: {
              if: { $gt: [{ $size: '$submissions' }, 0] },
              then: { $avg: '$submissions.score' },
              else: 0
            }
          }
        }
      },
      {
        $project: {
          assignment: '$title',
          score: { $round: ['$averageScore', 1] },
          submissions: '$totalSubmissions',
          status: 1
        }
      },
      {
        $sort: { score: -1 }
      },
      {
        $limit: 5
      }
    ]);

    if (assignmentPerformance.length === 0) {
      const allAssignmentData = await AssignmentModel.aggregate([
        {
          $lookup: {
            from: 'usersubmissions',
            localField: '_id',
            foreignField: 'assignmentId',
            as: 'submissions'
          }
        },
        {
          $addFields: {
            totalSubmissions: { $size: '$submissions' },
            averageScore: {
              $cond: {
                if: { $gt: [{ $size: '$submissions' }, 0] },
                then: { $avg: '$submissions.score' },
                else: 0
              }
            }
          }
        },
        {
          $project: {
            assignment: '$title',
            score: { $round: ['$averageScore', 1] },
            submissions: '$totalSubmissions',
            status: 1
          }
        },
        {
          $sort: { score: -1 }
        },
        {
          $limit: 5
        }
      ]);

      return {
        assignmentPerformance: allAssignmentData.map(item => ({
          assignment: `${item.assignment} (${item.status})`,
          score: item.score,
          submissions: item.submissions
        }))
      };
    }

    return {
      assignmentPerformance: assignmentPerformance.map(item => ({
        assignment: item.assignment,
        score: item.score,
        submissions: item.submissions
      }))
    };
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

    recentActivities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    recentActivities.splice(10);

    return { recentActivities };
  }


} 