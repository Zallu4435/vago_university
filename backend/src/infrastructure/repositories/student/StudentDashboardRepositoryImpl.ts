// StudentDashboardRepositoryImpl.ts
import { IStudentDashboardRepository } from '../../../application/student/repositories/IStudentDashboardRepository';
import {
  GetStudentDashboardDataRequestDTO,
  GetAnnouncementsRequestDTO,
  GetDeadlinesRequestDTO,
  GetClassesRequestDTO,
  GetOnlineTopicsRequestDTO,
  GetCalendarDaysRequestDTO,
  GetSpecialDatesRequestDTO,
} from '../../../domain/student/dtos/StudentDashboardRequestDTOs';
import {
  GetStudentDashboardDataResponseDTO,
  GetAnnouncementsResponseDTO,
  GetDeadlinesResponseDTO,
  GetClassesResponseDTO,
  GetOnlineTopicsResponseDTO,
  GetCalendarDaysResponseDTO,
  GetSpecialDatesResponseDTO,
} from '../../../domain/student/dtos/StudentDashboardResponseDTOs';
import {
  Announcement,
  Deadline,
  ClassInfo,
  OnlineTopic,
  SpecialDate,
  StudentDashboardData
} from '../../../domain/student/entities/StudentDashboardTypes';
import { AssignmentModel } from '../../database/mongoose/assignment/AssignmentModel';
import { MessageModel } from '../../database/mongoose/models/communication.model';
import { CourseModel, EnrollmentModel } from '../../database/mongoose/models/courses/CourseModel';
import { MaterialModel } from '../../database/mongoose/material/MaterialModel';
import { CampusEventModel } from '../../database/mongoose/models/events/CampusEventModel';
import { TeamModel } from '../../database/mongoose/models/sports.model';
import { ClubModel, ClubRequestModel } from '../../database/mongoose/models/clubs/ClubModel';
import mongoose from 'mongoose';

export class StudentDashboardRepository implements IStudentDashboardRepository {
  async getStudentDashboardData(params: GetStudentDashboardDataRequestDTO): Promise<GetStudentDashboardDataResponseDTO> {
    try {
      console.log('[StudentDashboardRepository] getStudentDashboardData - Params:', params);
      const [announcements, deadlines, classes, onlineTopics, calendarDays, specialDates] = await Promise.all([
        params.includeAnnouncements !== false ? this.getAnnouncements({ studentId: params.studentId }) : Promise.resolve({ success: true, data: [] }),
        params.includeDeadlines !== false ? this.getDeadlines({ studentId: params.studentId }) : Promise.resolve({ success: true, data: [] }),
        params.includeClasses !== false ? this.getClasses({ studentId: params.studentId }) : Promise.resolve({ success: true, data: [] }),
        params.includeOnlineTopics !== false ? this.getOnlineTopics({ studentId: params.studentId }) : Promise.resolve({ success: true, data: [] }),
        params.includeCalendarDays !== false ? this.getCalendarDays({ studentId: params.studentId }) : Promise.resolve({ success: true, data: [] }),
        params.includeSpecialDates !== false ? this.getSpecialDates({ studentId: params.studentId }) : Promise.resolve({ success: true, data: [] })
      ]);

      console.log('[StudentDashboardRepository] getStudentDashboardData - Success');
      return {
        success: true,
        data: {
          announcements: announcements.data || [],
          deadlines: deadlines.data || [],
          classes: classes.data || [],
          onlineTopics: onlineTopics.data || [],
          calendarDays: calendarDays.data || [],
          specialDates: specialDates.data || []
        }
      };
    } catch (error) {
      console.error('[StudentDashboardRepository] getStudentDashboardData - Error:', error);
      throw error;
    }
  }

  async getAnnouncements(params: GetAnnouncementsRequestDTO): Promise<GetAnnouncementsResponseDTO> {
    try {
      console.log('[StudentDashboardRepository] getAnnouncements - Params:', params);
      const query: any = {
        'recipients.id': params.studentId,
        isBroadcast: true
      };

      if (params.startDate) {
        query.createdAt = { $gte: new Date(params.startDate) };
      }
      if (params.endDate) {
        query.createdAt = { ...query.createdAt, $lte: new Date(params.endDate) };
      }

      const messages = await MessageModel.find(query)
      .sort({ createdAt: -1 })
        .limit(params.limit || 10)
      .lean();

      console.log('[StudentDashboardRepository] getAnnouncements - Success:', { count: messages.length });
      return {
        success: true,
        data: messages.map(m => ({
          id: m._id.toString(),
          title: m.subject || 'No Subject',
          content: m.content || '',
          date: m.createdAt,
          sender: m.sender?.name || 'System',
          hasAttachments: Array.isArray(m.attachments) && m.attachments.length > 0
        }))
      };
    } catch (error) {
      console.error('[StudentDashboardRepository] getAnnouncements - Error:', error);
      throw error;
    }
  }

  async getDeadlines(params: GetDeadlinesRequestDTO): Promise<GetDeadlinesResponseDTO> {
    try {
      console.log('[StudentDashboardRepository] getDeadlines - Params:', params);
      const query: any = {
        assignedTo: params.studentId,
        dueDate: { $gte: new Date() }
      };

      if (params.startDate) {
        query.dueDate.$gte = new Date(params.startDate);
      }
      if (params.endDate) {
        query.dueDate.$lte = new Date(params.endDate);
      }
      if (params.urgentOnly) {
        query.priority = 'high';
      }
      if (params.courseId) {
        query.courseId = params.courseId;
      }

      const assignments = await AssignmentModel.find(query)
        .sort({ dueDate: 1 })
        .lean();

      console.log('[StudentDashboardRepository] getDeadlines - Success:', { count: assignments.length });
      return {
        success: true,
        data: assignments.map(a => ({
      id: a._id.toString(),
          title: a.title || 'Untitled Assignment',
      date: a.dueDate,
          urgent: a.priority === 'high',
          courseId: a.courseId?.toString(),
          type: a.type || 'assignment'
        }))
      };
    } catch (error) {
      console.error('[StudentDashboardRepository] getDeadlines - Error:', error);
      throw error;
    }
  }

  async getClasses(params: GetClassesRequestDTO): Promise<GetClassesResponseDTO> {
    try {
      console.log('[StudentDashboardRepository] getClasses - Params:', params);
      const query: any = {
        studentId: params.studentId,
        status: 'Approved'
      };

      if (params.term) {
        query.term = params.term;
      }

      const enrollments = await EnrollmentModel.find(query)
        .populate('courseId')
        .populate('facultyId')
        .lean();

      console.log('[StudentDashboardRepository] getClasses - Success:', { enrollmentsCount: enrollments.length });
      return {
        success: true,
        data: enrollments.map(e => ({
          id: e._id.toString(),
          title: e.courseId?.name || 'Unknown Course',
          faculty: e.facultyId?.name || 'TBD',
          schedule: e.schedule || 'TBD',
          credits: e.courseId?.credits || 0,
          specialization: e.courseId?.specialization || 'General',
          currentEnrollment: e.courseId?.currentEnrollment || 0,
          maxEnrollment: e.courseId?.maxEnrollment || 0
        }))
      };
    } catch (error) {
      console.error('[StudentDashboardRepository] getClasses - Error:', error);
      throw error;
    }
  }

  async getOnlineTopics(params: GetOnlineTopicsRequestDTO): Promise<GetOnlineTopicsResponseDTO> {
    try {
      console.log('[StudentDashboardRepository] getOnlineTopics - Params:', params);
      const query: any = {
        studentId: params.studentId,
        status: 'Approved'
      };

      if (params.courseId) {
        query.courseId = params.courseId;
      }

      const enrollments = await EnrollmentModel.find(query)
        .populate({
          path: 'courseId',
          populate: {
            path: 'topics'
          }
        })
        .lean();

      const topics = enrollments.flatMap(e => 
        (e.courseId?.topics || []).map(t => ({
      id: t._id.toString(),
          title: t.title || 'Untitled Topic',
          courseId: e.courseId?._id.toString(),
      votes: t.votes || 0,
          voted: params.includeVoted ? (t.votedBy || []).includes(params.studentId) : false,
          createdAt: t.createdAt
        }))
      );

      if (params.limit) {
        topics.splice(params.limit);
      }

      console.log('[StudentDashboardRepository] getOnlineTopics - Success:', { topicsCount: topics.length });
      return {
        success: true,
        data: topics
      };
    } catch (error) {
      console.error('[StudentDashboardRepository] getOnlineTopics - Error:', error);
      throw error;
    }
  }

  async getCalendarDays(params: GetCalendarDaysRequestDTO): Promise<GetCalendarDaysResponseDTO> {
    try {
      console.log('[StudentDashboardRepository] getCalendarDays - Starting with params:', params);
      const dateQuery: any = {};
      
      if (params.month !== undefined && params.year !== undefined) {
        const startDate = new Date(params.year, params.month - 1, 1);
        const endDate = new Date(params.year, params.month, 0);
        dateQuery.date = { $gte: startDate, $lte: endDate };
        console.log('[StudentDashboardRepository] getCalendarDays - Date range:', { startDate, endDate });
      }

      // Get enrollments first
      console.log('[StudentDashboardRepository] getCalendarDays - Fetching enrollments');
      const enrollments = await EnrollmentModel.find({
        studentId: params.studentId,
        status: 'Approved'
      }).select('courseId').lean();
      console.log('[StudentDashboardRepository] getCalendarDays - Found enrollments:', enrollments.length);

      // Fetch data from each model
      console.log('[StudentDashboardRepository] getCalendarDays - Starting parallel queries');
      const [courses, events, sports, clubs] = await Promise.all([
        CourseModel.find({
          _id: { $in: enrollments.map(e => e.courseId) },
          ...dateQuery
        }).lean().then(results => {
          console.log('[StudentDashboardRepository] getCalendarDays - Courses found:', results.length);
          return results;
        }),

        CampusEventModel.find({
          $or: [
            { studentIds: params.studentId },
            { isPublic: true }
          ],
          ...dateQuery
        }).lean().then(results => {
          console.log('[StudentDashboardRepository] getCalendarDays - Events found:', results.length);
          return results;
        }),

        TeamModel.find({
          $or: [
            { 'participants.id': params.studentId },
            { status: 'Active' }
          ],
          ...dateQuery
        }).lean().then(results => {
          console.log('[StudentDashboardRepository] getCalendarDays - Sports found:', results.length);
          return results;
        }),

        ClubModel.find({
          $or: [
            { 'members.id': params.studentId },
            { status: 'Active' }
          ],
          ...dateQuery
        }).lean().then(results => {
          console.log('[StudentDashboardRepository] getCalendarDays - Clubs found:', results.length);
          return results;
        })
      ]);

      console.log('[StudentDashboardRepository] getCalendarDays - Processing dates');
      const allDates = [
        ...courses.map(c => ({ date: c.date, type: 'course' })),
        ...events.map(e => ({ date: e.date, type: 'event' })),
        ...sports.map(s => ({ date: s.date, type: 'sport' })),
        ...clubs.map(c => ({ date: c.date, type: 'club' }))
      ].filter(item => item.date);

      console.log('[StudentDashboardRepository] getCalendarDays - Dates by type:', {
        courses: courses.length,
        events: events.length,
        sports: sports.length,
        clubs: clubs.length,
        totalDates: allDates.length
      });

      const uniqueDays = Array.from(new Set(allDates.map(item => item.date?.getDate())))
        .filter(day => day !== undefined && day !== null)
        .sort((a, b) => a - b);

      console.log('[StudentDashboardRepository] getCalendarDays - Final unique days:', uniqueDays.length);
      return {
        success: true,
        data: uniqueDays
      };
    } catch (error) {
      console.error('[StudentDashboardRepository] getCalendarDays - Error:', error);
      console.error('[StudentDashboardRepository] getCalendarDays - Error stack:', error.stack);
      throw error;
    }
  }

  async getSpecialDates(params: GetSpecialDatesRequestDTO): Promise<GetSpecialDatesResponseDTO> {
    try {
      console.log('[StudentDashboardRepository] getSpecialDates - Starting with params:', params);
      const dateQuery: any = {};
      
      if (params.month !== undefined && params.year !== undefined) {
        const startDate = new Date(params.year, params.month - 1, 1);
        const endDate = new Date(params.year, params.month, 0);
        dateQuery.date = { $gte: startDate, $lte: endDate };
        console.log('[StudentDashboardRepository] getSpecialDates - Date range:', { startDate, endDate });
      }

      console.log('[StudentDashboardRepository] getSpecialDates - Starting parallel queries');
      const [events, sports, clubs] = await Promise.all([
        CampusEventModel.find({
          $or: [
            { studentIds: params.studentId },
            { isPublic: true }
          ],
          ...dateQuery
        }).lean().then(results => {
          console.log('[StudentDashboardRepository] getSpecialDates - Events found:', results.length);
          console.log('[StudentDashboardRepository] getSpecialDates - Sample event:', results[0]);
          return results;
        }),

        TeamModel.find({
          $or: [
            { 'participants.id': params.studentId },
            { status: 'Active' }
          ],
          ...dateQuery
        }).lean().then(results => {
          console.log('[StudentDashboardRepository] getSpecialDates - Sports found:', results.length);
          console.log('[StudentDashboardRepository] getSpecialDates - Sample sport:', results[0]);
          return results;
        }),

        ClubModel.find({
          $or: [
            { 'members.id': params.studentId },
            { status: 'Active' }
          ],
          ...dateQuery
        }).lean().then(results => {
          console.log('[StudentDashboardRepository] getSpecialDates - Clubs found:', results.length);
          console.log('[StudentDashboardRepository] getSpecialDates - Sample club:', results[0]);
          return results;
        })
      ]);

      console.log('[StudentDashboardRepository] getSpecialDates - Processing special dates');
      const specialDates = [
        ...events.map(e => {
          const date = e.date?.getDate();
          console.log('[StudentDashboardRepository] getSpecialDates - Processing event:', { id: e._id, date });
          return {
            day: date,
            type: 'event' as const,
            title: e.name || 'Untitled Event',
            isPublic: e.isPublic || false,
            icon: e.icon
          };
        }),
        ...sports.map(s => {
          const date = s.date?.getDate();
          console.log('[StudentDashboardRepository] getSpecialDates - Processing sport:', { id: s._id, date });
          return {
            day: date,
            type: 'sports' as const,
            title: s.name || 'Untitled Sport Event',
            isPublic: s.isPublic || false,
            sportType: s.type,
            division: s.division,
            icon: s.icon
          };
        }),
        ...clubs.map(c => {
          const date = c.date?.getDate();
          console.log('[StudentDashboardRepository] getSpecialDates - Processing club:', { id: c._id, date });
          return {
            day: date,
            type: 'club' as const,
            title: c.name || 'Untitled Club Event',
            isPublic: c.isPublic || false,
            clubType: c.type,
            icon: c.icon
          };
        })
      ].filter(date => {
        const isValid = date.day !== undefined && date.day !== null;
        if (!isValid) {
          console.log('[StudentDashboardRepository] getSpecialDates - Filtered out invalid date:', date);
        }
        return isValid;
      });

      console.log('[StudentDashboardRepository] getSpecialDates - Final special dates:', {
        total: specialDates.length,
        byType: {
          events: specialDates.filter(d => d.type === 'event').length,
          sports: specialDates.filter(d => d.type === 'sports').length,
          clubs: specialDates.filter(d => d.type === 'club').length
        }
      });

    return {
        success: true,
        data: specialDates.sort((a, b) => a.day - b.day)
      };
    } catch (error) {
      console.error('[StudentDashboardRepository] getSpecialDates - Error:', error);
      console.error('[StudentDashboardRepository] getSpecialDates - Error stack:', error.stack);
      throw error;
    }
  }
} 