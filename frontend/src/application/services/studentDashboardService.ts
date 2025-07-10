import httpClient from "../../frameworks/api/httpClient";

export interface Announcement {
  title: string;
  date: string;
}

export interface Deadline {
  title: string;
  date: string;
  urgent?: boolean;
}

export interface ClassInfo {
  code: string;
  name: string;
  time: string;
  room: string;
  status: string;
}

export interface OnlineTopic {
  title: string;
  votes: number;
  voted: boolean;
}

export interface StudentDashboardData {
  announcements: Announcement[];
  deadlines: Deadline[];
  classes: ClassInfo[];
  onlineTopics: OnlineTopic[];
  calendarDays: number[];
  specialDates: Record<number, { type: 'exam' | 'deadline' | 'event' }>;
}

class StudentDashboardService {
  async getAnnouncements(): Promise<Announcement[]> {
    const response = await httpClient.get('/student/dashboard/announcements');
    return response.data.data;
  }

  async getDeadlines(): Promise<Deadline[]> {
    const response = await httpClient.get('/student/dashboard/deadlines');
    return response.data.data;
  }

  async getClasses(): Promise<ClassInfo[]> {
    const response = await httpClient.get('/student/dashboard/classes');
    return response.data.data;
  }

  async getOnlineTopics(): Promise<OnlineTopic[]> {
    const response = await httpClient.get('/student/dashboard/online-topics');
    return response.data.data;
  }

  async getCalendarDays(): Promise<number[]> {
    const response = await httpClient.get('/student/dashboard/calendar-days');
    return response.data.data;
  }

  async getSpecialDates(): Promise<Record<number, { type: 'exam' | 'deadline' | 'event' }>> {
    const response = await httpClient.get('/student/dashboard/special-dates');
    return response.data.data;
  }

  async getAllDashboardData(): Promise<StudentDashboardData> {
    const [
      announcements,
      deadlines,
      classes,
      onlineTopics,
      calendarDays,
      specialDates
    ] = await Promise.all([
      this.getAnnouncements(),
      this.getDeadlines(),
      this.getClasses(),
      this.getOnlineTopics(),
      this.getCalendarDays(),
      this.getSpecialDates()
    ]);
    return {
      announcements,
      deadlines,
      classes,
      onlineTopics,
      calendarDays,
      specialDates
    };
  }
}

export const studentDashboardService = new StudentDashboardService(); 