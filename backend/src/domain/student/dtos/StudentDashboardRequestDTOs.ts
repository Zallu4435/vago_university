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

export interface GetCalendarDaysRequestDTO {
  studentId: string;
  month?: number;
  year?: number;
  includeTypes?: ('class' | 'event' | 'sports' | 'club')[];
}

export interface GetUserInfoRequestDTO {
  studentId: string;
}
