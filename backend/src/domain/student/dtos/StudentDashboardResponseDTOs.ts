import {
  StudentDashboardData,
  Announcement,
  Deadline,
  ClassInfo,
  OnlineTopic,
  SpecialDate
} from '../entities/StudentDashboardTypes';

export interface AnnouncementDTO {
  id: string;
  title: string;
  content: string;
  date: Date;
  sender: string;
  hasAttachments: boolean;
}

export interface DeadlineDTO {
  id: string;
  title: string;
  date: Date;
  urgent: boolean;
  courseId?: string;
  type: string;
}

export interface ClassInfoDTO {
  id: string;
  title: string;
  faculty: string;
  schedule: string;
  credits: number;
  specialization: string;
  currentEnrollment: number;
  maxEnrollment: number;
}

export interface OnlineTopicDTO {
  id: string;
  title: string;
  courseId?: string;
  votes: number;
  voted: boolean;
  createdAt: Date;
}

export interface SpecialDateDTO {
  day: number;
  type: 'event' | 'sports' | 'club';
  title: string;
  isPublic: boolean;
  sportType?: string;
  division?: string;
  clubType?: string;
  icon?: string;
}

export interface StudentDashboardDataDTO {
  announcements: AnnouncementDTO[];
  deadlines: DeadlineDTO[];
  classes: ClassInfoDTO[];
  onlineTopics: OnlineTopicDTO[];
  calendarDays: number[];
  specialDates: SpecialDateDTO[];
}

export interface GetStudentDashboardDataResponseDTO {
  success: boolean;
  data: StudentDashboardDataDTO;
  message?: string;
  error?: string;
}

export interface GetAnnouncementsResponseDTO {
  success: boolean;
  data: AnnouncementDTO[];
  message?: string;
  error?: string;
}

export interface GetDeadlinesResponseDTO {
  success: boolean;
  data: DeadlineDTO[];
  message?: string;
  error?: string;
}

export interface GetClassesResponseDTO {
  success: boolean;
  data: ClassInfoDTO[];
  message?: string;
  error?: string;
}

export interface GetOnlineTopicsResponseDTO {
  success: boolean;
  data: OnlineTopicDTO[];
  message?: string;
  error?: string;
}

export interface GetCalendarDaysResponseDTO {
  success: boolean;
  data: number[];
  message?: string;
  error?: string;
}

export interface GetSpecialDatesResponseDTO {
  success: boolean;
  data: SpecialDateDTO[];
  message?: string;
  error?: string;
} 