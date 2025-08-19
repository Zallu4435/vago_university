import { Notification } from "../../../domain/notifications/entities/NotificationTypes";
import { IMessage } from "../../../infrastructure/database/mongoose/communication/communication.model";
import { IAssignmentDocument } from "../../../infrastructure/database/mongoose/assignment/AssignmentModel";
import { IVideoSession } from "../../../infrastructure/database/mongoose/session/session.model";
import { Event } from "../../../domain/events/entities/EventTypes";
import { Club } from "../../../domain/clubs/entities/ClubTypes";

export type LeanMessage = Omit<IMessage, keyof Document>;
export type StudentAnnouncementResult = [LeanMessage | null, Notification | null];

export interface IStudentDashboardRepository {
  getAnnouncements(): Promise<StudentAnnouncementResult>;
  getDeadlines(): Promise<IAssignmentDocument[]>;
  getClasses(): Promise<IVideoSession[]>;
  getCalendarDays(): Promise<{ events: Event[]; sports: Record<string, unknown>[]; clubs: Club[] }>;
  getNewEvents(): Promise<Record<string, unknown>[]>;
  getUserInfo(studentId: string): Promise<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
    course?: string;
  }>;
} 