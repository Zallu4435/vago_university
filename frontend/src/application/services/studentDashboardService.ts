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
  id: string;
  title: string;
  faculty: string;
  schedule: string;
  cousre: string;
  description: string;
}

export interface OnlineTopic {
  title: string;
  votes: number;
  voted: boolean;
}

export interface NewEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

export interface CalendarDayEntry {
  type: string;
  title: string;
  date: string;
}

export interface StudentDashboardData {
  announcements: Announcement[];
  deadlines: Deadline[];
  classes: ClassInfo[];
  newEvents: NewEvent[];
  calendarDays: Record<number, CalendarDayEntry[]>;
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

  async getNewEvents(): Promise<NewEvent[]> {
    const response = await httpClient.get('/student/dashboard/new-events');
    return response.data.data;
  }

  async getCalendarDays(): Promise<Record<number, CalendarDayEntry[]>> {
    const response = await httpClient.get('/student/dashboard/calendar-days');
    return response.data.data;
  }

  async getStudentInfo() {
    const response = await httpClient.get('/student/dashboard/user-info');
    return response.data;
  }

  async getAllDashboardData(): Promise<StudentDashboardData> {
    const [
      announcements,
      deadlines,
      classes,
      newEvents,
      calendarDays
    ] = await Promise.all([
      this.getAnnouncements(),
      this.getDeadlines(),
      this.getClasses(),
      this.getNewEvents(),
      this.getCalendarDays()
    ]);
    return {
      announcements,
      deadlines,
      classes,
      newEvents,
      calendarDays
    };
  }
}

export const studentDashboardService = new StudentDashboardService(); 