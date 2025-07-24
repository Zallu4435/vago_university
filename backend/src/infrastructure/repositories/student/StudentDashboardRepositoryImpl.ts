// StudentDashboardRepositoryImpl.ts
import { IStudentDashboardRepository } from '../../../application/student/repositories/IStudentDashboardRepository';
import {
  GetAnnouncementsRequestDTO,
  GetDeadlinesRequestDTO,
  GetClassesRequestDTO,
  GetCalendarDaysRequestDTO,
} from '../../../domain/student/dtos/StudentDashboardRequestDTOs';
import {
  GetAnnouncementsResponseDTO,
  GetDeadlinesResponseDTO,
  GetClassesResponseDTO,
  GetCalendarDaysResponseDTO,
} from '../../../domain/student/dtos/StudentDashboardResponseDTOs';

import { AssignmentModel } from '../../database/mongoose/assignment/AssignmentModel';
import { CampusEventModel } from '../../database/mongoose/models/events/CampusEventModel';
import { TeamModel } from '../../database/mongoose/models/sports.model';
import { ClubModel } from '../../database/mongoose/models/clubs/ClubModel';
import { NotificationModel } from '../../database/mongoose/models/notification.model';
import { MessageModel } from '../../database/mongoose/models/communication.model';
import { VideoSessionModel } from '../../database/mongoose/models/session.model';
import { User as UserModel } from '../../database/mongoose/auth/user.model';
import { ProgramModel } from '../../database/mongoose/models/studentProgram.model';

export class StudentDashboardRepository implements IStudentDashboardRepository {
  
  async getAnnouncements(params: GetAnnouncementsRequestDTO): Promise<GetAnnouncementsResponseDTO> {
    console.log('[StudentDashboardRepository] getAnnouncements - Called with params:', params);
    try {
      console.log('[StudentDashboardRepository] getAnnouncements - Params:', params);
      // Fetch the most recent message announcement
      const latestMessage = await MessageModel.findOne({
        isBroadcast: true
      }).sort({ createdAt: -1 }).lean();

      // Fetch the most recent notification announcement
      let latestNotification = null;
      try {
        latestNotification = await NotificationModel.findOne({
          recipientType: 'all_students'
        }).sort({ createdAt: -1 }).lean();
      } catch (e) {
        console.warn('NotificationModel not found or failed:', e);
      }

      return [latestMessage, latestNotification];
    } catch (error) {
      console.error('[StudentDashboardRepository] getAnnouncements - Error:', error);
      throw error;
    }
  }

  async getDeadlines(params: GetDeadlinesRequestDTO): Promise<GetDeadlinesResponseDTO> {
    console.log('[StudentDashboardRepository] getDeadlines - Called with params:', params);
    try {
      console.log('[StudentDashboardRepository] getDeadlines - Params:', params);

      const assignments = await AssignmentModel.find()
        .sort({ dueDate: 1 })
        .lean();
      // Only return raw assignments, no mapping
      return assignments;
    } catch (error) {
      console.error('[StudentDashboardRepository] getDeadlines - Error:', error);
      throw error;
    }
  }

  async getClasses(params: GetClassesRequestDTO): Promise<GetClassesResponseDTO> {
    console.log('[StudentDashboardRepository] getClasses - Called with params:', params);
    try {
      console.log('[StudentDashboardRepository] getClasses - Params:', params);
      const sessionDocs = await VideoSessionModel.find().lean();
      // Only return raw session documents
      return sessionDocs;
    } catch (error) {
      console.error('[StudentDashboardRepository] getClasses - Error:', error);
      throw error;
    }
  }

  async getCalendarDays(params: GetCalendarDaysRequestDTO): Promise<GetCalendarDaysResponseDTO> {
    console.log('[StudentDashboardRepository] getCalendarDays - Called with params:', params);
    try {
      console.log('[StudentDashboardRepository] getCalendarDays - Starting with params:', params);
      const [events, sports, clubs] = await Promise.all([
        CampusEventModel.find().lean(),
        TeamModel.find().lean(),
        ClubModel.find().lean()
      ]);

      // Only return raw data for use case to process
      return {
        events,
        sports,
        clubs
      };
    } catch (error) {
      console.error('[StudentDashboardRepository] getCalendarDays - Error:', error);
      console.error('[StudentDashboardRepository] getCalendarDays - Error stack:', error.stack);
      throw error;
    }
  }

  async getNewEvents(studentId: string): Promise<any[]> {
    console.log('[StudentDashboardRepository] getNewEvents - Called with studentId:', studentId);
    try {
      const [latestEvent, latestSport, latestClub] = await Promise.all([
        CampusEventModel.findOne().sort({ date: -1 }).lean(),
        TeamModel.findOne().sort({ date: -1 }).lean(),
        ClubModel.findOne().sort({ date: -1 }).lean(),
      ]);
      return [latestEvent, latestSport, latestClub];
    } catch (error) {
      console.error('[StudentDashboardRepository] getNewEvents - Error:', error);
      throw error;
    }
  }

  async getUserInfo(params: { studentId: string }): Promise<any> {
    const user = await UserModel.findById(params.studentId).select('firstName lastName email profilePicture').lean();
    if (!user) {
      throw new Error('User not found');
    }
    const program = await ProgramModel.findOne({ studentId: params.studentId }).select('degree').lean();
    return {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicture: user.profilePicture,
      course: program ? program.degree : undefined,
    };
  }
} 