export interface Announcement {
  id: string;
  title: string;
  date: string;
}

export interface Deadline {
  id: string;
  title: string;
  date: string;
  urgent?: boolean;
}

export interface ClassInfo {
  id: string;
  code: string;
  name: string;
  time: string;
  room: string;
  status: string;
}

export interface OnlineTopic {
  id: string;
  title: string;
  votes: number;
  voted: boolean;
}

export interface SpecialDate {
  day: number;
  type: 'exam' | 'deadline' | 'event';
}

export interface StudentDashboardData {
  announcements: Announcement[];
  deadlines: Deadline[];
  classes: ClassInfo[];
  onlineTopics: OnlineTopic[];
  calendarDays: number[];
  specialDates: SpecialDate[];
} 
