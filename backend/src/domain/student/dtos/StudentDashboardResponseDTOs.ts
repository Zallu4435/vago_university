
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


export interface NewEventDTO {
  id: string;
  title: string;
  date: Date;
  location: string;
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

export interface GetCalendarDaysResponseDTO {
  success: boolean;
  data: number[];
  message?: string;
  error?: string;
}

export interface GetUserInfoResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  course?: string;
}
