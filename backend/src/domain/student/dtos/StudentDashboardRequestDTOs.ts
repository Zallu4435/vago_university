// StudentDashboardRequestDTOs.ts

export interface GetStudentDashboardDataRequestDTO {
  studentId: string;
  includeAnnouncements?: boolean;
  includeDeadlines?: boolean;
  includeClasses?: boolean;
  includeOnlineTopics?: boolean;
  includeCalendarDays?: boolean;
  includeSpecialDates?: boolean;
}

export interface GetAnnouncementsRequestDTO {
  studentId: string;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface GetDeadlinesRequestDTO {
  studentId: string;
  startDate?: string;
  endDate?: string;
  urgentOnly?: boolean;
  courseId?: string;
}

export interface GetClassesRequestDTO {
  studentId: string;
  term?: string;
  status?: 'upcoming' | 'ongoing' | 'completed';
}

export interface GetOnlineTopicsRequestDTO {
  studentId: string;
  courseId?: string;
  limit?: number;
  includeVoted?: boolean;
}

export interface GetCalendarDaysRequestDTO {
  studentId: string;
  month?: number;
  year?: number;
  includeTypes?: ('class' | 'event' | 'sports' | 'club')[];
}

export interface GetSpecialDatesRequestDTO {
  studentId: string;
  month?: number;
  year?: number;
  types?: ('event' | 'sports' | 'club')[];
} 