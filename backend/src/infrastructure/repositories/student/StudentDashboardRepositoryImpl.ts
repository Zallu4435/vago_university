import { IStudentDashboardRepository, StudentAnnouncementResult, LeanMessage } from '../../../application/student/repositories/IStudentDashboardRepository';
import { AssignmentModel } from '../../database/mongoose/assignment/AssignmentModel';
import { CampusEventModel } from '../../database/mongoose/models/events/CampusEventModel';
import { TeamModel } from '../../database/mongoose/models/sports.model';
import { ClubModel } from '../../database/mongoose/models/clubs/ClubModel';
import { NotificationModel } from '../../database/mongoose/models/notification.model';
import { VideoSessionModel } from '../../database/mongoose/models/session.model';
import { User as UserModel } from '../../database/mongoose/auth/user.model';
import { ProgramModel } from '../../database/mongoose/models/studentProgram.model';
import { MessageModel } from '../../database/mongoose/models/communication.model';
import { Event } from '../../../domain/events/entities/EventTypes';
import { Sport } from '../../../domain/sports/entities/Sport';
import { Club } from '../../../domain/clubs/entities/ClubTypes';

export class StudentDashboardRepository implements IStudentDashboardRepository {

  async getAnnouncements(): Promise<StudentAnnouncementResult> {
    const latestMessage = await (MessageModel as import("mongoose").Model<import("../../database/mongoose/models/communication.model").IMessage>).findOne({
      isBroadcast: true
    }).sort({ createdAt: -1 }).lean() as unknown as LeanMessage | null;

    const latestNotification = await NotificationModel.findOne({
      recipientType: 'all_students'
    }).sort({ createdAt: -1 }).lean();

    return [latestMessage, latestNotification];
  }

  async getDeadlines() {
    const assignments = await AssignmentModel.find()
      .sort({ dueDate: 1 })
      .limit(3)
      .lean();
    return assignments;
  }

  async getClasses() {
    const sessionDocs = await VideoSessionModel.find().sort({ createdAt: -1 }).limit(3).lean();
    return sessionDocs;
  }

  async getCalendarDays() {
    const [events, sports, clubs] = await Promise.all([
      CampusEventModel.find().lean(),
      TeamModel.find().lean(),
      ClubModel.find().lean()
    ]);

    return {
      events: events as unknown as Event[],
      sports: sports as unknown as Sport[],
      clubs: clubs as unknown as Club[]
    };
  }

  async getNewEvents() {
    const [latestEvent, latestSport, latestClub] = await Promise.all([
      CampusEventModel.findOne().sort({ date: -1 }).lean(),
      TeamModel.findOne().sort({ date: -1 }).lean(),
      ClubModel.findOne().sort({ date: -1 }).lean(),
    ]);
    return [latestEvent, latestSport, latestClub];
  }

  async getUserInfo(studentId: string) {
    const user = await UserModel.findById(studentId).select('firstName lastName email profilePicture').lean();
    if (!user) {
      throw new Error('User not found');
    }
    const program = await ProgramModel.findOne({ studentId: studentId }).select('degree').lean();
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