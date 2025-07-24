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
    const latestMessage = await MessageModel.findOne({
      isBroadcast: true
    }).sort({ createdAt: -1 }).lean();

    let latestNotification = null;
    latestNotification = await NotificationModel.findOne({
      recipientType: 'all_students'
    }).sort({ createdAt: -1 }).lean();

    return [latestMessage, latestNotification];
  }

  async getDeadlines(params: GetDeadlinesRequestDTO): Promise<GetDeadlinesResponseDTO> {
    const assignments = await AssignmentModel.find()
      .sort({ dueDate: 1 })
      .limit(3)
      .lean();
    return assignments;
  }

  async getClasses(params: GetClassesRequestDTO): Promise<GetClassesResponseDTO> {
    const sessionDocs = await VideoSessionModel.find().sort({ createdAt: -1 }).limit(3).lean();
    return sessionDocs;
  }

  async getCalendarDays(params: GetCalendarDaysRequestDTO): Promise<GetCalendarDaysResponseDTO> {
    const [events, sports, clubs] = await Promise.all([
      CampusEventModel.find().lean(),
      TeamModel.find().lean(),
      ClubModel.find().lean()
    ]);

    return {
      events,
      sports,
      clubs
    };
  }

  async getNewEvents(studentId: string): Promise<any[]> {
    const [latestEvent, latestSport, latestClub] = await Promise.all([
      CampusEventModel.findOne().sort({ date: -1 }).lean(),
      TeamModel.findOne().sort({ date: -1 }).lean(),
      ClubModel.findOne().sort({ date: -1 }).lean(),
    ]);
    return [latestEvent, latestSport, latestClub];
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