import {
  GetAnnouncementsRequestDTO,
  GetDeadlinesRequestDTO,
  GetClassesRequestDTO,
  GetCalendarDaysRequestDTO,
  GetUserInfoRequestDTO,
} from "../../../domain/student/dtos/StudentDashboardRequestDTOs";

import {
  GetDeadlinesResponseDTO,
  GetClassesResponseDTO,
  GetCalendarDaysResponseDTO,
  NewEventDTO as BaseNewEventDTO,
  GetUserInfoResponseDTO,
} from "../../../domain/student/dtos/StudentDashboardResponseDTOs";

import { IStudentDashboardRepository } from "../repositories/IStudentDashboardRepository";
import { IAssignmentDocument } from "../../../infrastructure/database/mongoose/assignment/AssignmentModel";
import { IVideoSession } from "../../../infrastructure/database/mongoose/models/session.model";
import { Event } from "../../../domain/events/entities/EventTypes";
import { Sport } from "../../../domain/sports/entities/Sport";
import { Club } from "../../../domain/clubs/entities/ClubTypes";

interface ResponseDTO<T> {
  data: T | { error: string };
  success: boolean;
}

export interface IGetAnnouncementsUseCase {
  execute(params: GetAnnouncementsRequestDTO): Promise<ResponseDTO<{ title: string; date: Date }[]>>;
}

export interface IGetDeadlinesUseCase {
  execute(params: GetDeadlinesRequestDTO): Promise<GetDeadlinesResponseDTO>;
}

export interface IGetClassesUseCase {
  execute(params: GetClassesRequestDTO): Promise<GetClassesResponseDTO>;
}

export interface IGetCalendarDaysUseCase {
  execute(params: GetCalendarDaysRequestDTO): Promise<GetCalendarDaysResponseDTO>;
}

export interface IGetNewEventsUseCase {
  execute(studentId: string): Promise<ResponseDTO<NewEventDTO[]>>;
}

export interface IGetUserInfoForDashboardUseCase {
  execute(params: GetUserInfoRequestDTO): Promise<ResponseDTO<GetUserInfoResponseDTO>>;
}

type NewEventDTO = BaseNewEventDTO & { description: string };


export class GetAnnouncementsUseCase implements IGetAnnouncementsUseCase {
  constructor(private studentDashboardRepository: IStudentDashboardRepository) { }

  async execute(): Promise<ResponseDTO<{ title: string; date: Date }[]>> {
    const [latestMessage, latestNotification] = await this.studentDashboardRepository.getAnnouncements();
    const announcements: { title: string; date: Date }[] = [];
    if (latestMessage) {
      announcements.push({
        title: latestMessage.subject || 'No Subject',
        date: latestMessage.createdAt,
      });
    }
    if (latestNotification) {
      announcements.push({
        title: latestNotification.title || 'No Title',
        date: latestNotification.createdAt, 
      });
    }
    return { data: announcements, success: true };
  }
}

export class GetDeadlinesUseCase implements IGetDeadlinesUseCase {
  constructor(private studentDashboardRepository: IStudentDashboardRepository) { }

  async execute(): Promise<GetDeadlinesResponseDTO> {
    const assignments: IAssignmentDocument[] = await this.studentDashboardRepository.getDeadlines();
    const mappedDeadlines = assignments.map(a => ({
      id: a._id?.toString?.() || a.id?.toString?.() || '',
      title: a.title,
      date: a.dueDate,
      urgent: a.status === 'draft' || (a.dueDate && (new Date(a.dueDate).getTime() - Date.now()) < 3 * 24 * 60 * 60 * 1000),
      type: 'assignment'
    }));
    return { data: mappedDeadlines, success: true };
  }
}

export class GetClassesUseCase implements IGetClassesUseCase {
  constructor(private studentDashboardRepository: IStudentDashboardRepository) { }

  async execute(): Promise<GetClassesResponseDTO> {
    const sessionDocs: IVideoSession[] = await this.studentDashboardRepository.getClasses();
    // Map to ClassInfoDTO structure for frontend
    const mappedClasses = sessionDocs.map(s => ({
      id: s._id?.toString?.() || '',
      title: s.title,
      faculty: s.instructor || '',
      schedule: s.startTime ? new Date(s.startTime).toISOString() : '',
      cousre: s.course,
      description: s.description
    }));
    return { data: mappedClasses, success: true };
  }
}

export class GetCalendarDaysUseCase implements IGetCalendarDaysUseCase {
  constructor(private studentDashboardRepository: IStudentDashboardRepository) { }

  async execute(): Promise<GetCalendarDaysResponseDTO> {
    const { events, sports, clubs }: { events: Event[]; sports: Sport[]; clubs: Club[] } = await this.studentDashboardRepository.getCalendarDays();
    // Build a map of days to event/sport/club info
    const dayTypeMap: Record<number, { type: string; title: string; date: string }[]> = {};
    function addEntry(dateStr: string, type: string, title: string) {
      if (!dateStr) return;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return;
      const day = d.getDate();
      if (!dayTypeMap[day]) dayTypeMap[day] = [];
      dayTypeMap[day].push({ type, title, date: dateStr });
    }
    events.forEach(e => addEntry(e.date, 'event', e.title));
    sports.forEach(s => {
      if (Array.isArray(s.getUpcomingGames())) {
        s.getUpcomingGames().forEach(g => addEntry(g.date, 'sport', s.getTitle()));
      }
    });
    clubs.forEach(c => {
      if (Array.isArray(c.upcomingEvents)) {
        c.upcomingEvents.forEach(ev => addEntry(ev.date, 'club', c.name));
      }
    });
    return { data: dayTypeMap, success: true };
  }
}

export class GetNewEventsUseCase implements IGetNewEventsUseCase {
  constructor(private studentDashboardRepository: IStudentDashboardRepository) { }

  async execute(): Promise<ResponseDTO<NewEventDTO[]>> {
    const [latestEvent, latestSport, latestClub] = await this.studentDashboardRepository.getNewEvents();
    const events: NewEventDTO[] = [];
    if (latestEvent) {
      events.push({
        id: latestEvent._id.toString(),
        title: latestEvent.title || 'Untitled Event',
        date: latestEvent.date,
        location: latestEvent.location || 'Campus',
        description: latestEvent.description || '',
      });
    }
    if (latestSport) {
      let sportDate = latestSport.getCreatedAt().toISOString();
      let sportDescription = '';
      if (Array.isArray(latestSport.getUpcomingGames()) && latestSport.getUpcomingGames().length > 0) {
        const sortedGames = [...latestSport.getUpcomingGames()].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        sportDate = sortedGames[0].date;
        sportDescription = sortedGames[0].description || '';
      }
      events.push({
        id: latestSport.getId() || '',
        title: latestSport.getTitle() || 'Latest Sport Event',
        date: sportDate,
        location: latestSport.getHomeGames()?.toString() || 'Sports Complex',
        description: sportDescription || latestSport.getDivision() || '',
      });
    }
    if (latestClub) {
      let clubDate = latestClub.date;
      let clubDescription = latestClub.about || '';
      if (Array.isArray(latestClub.upcomingEvents) && latestClub.upcomingEvents.length > 0) {
        const sortedEvents = [...latestClub.upcomingEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        clubDate = sortedEvents[0].date;
        clubDescription = sortedEvents[0].description || clubDescription;
      }
      events.push({
        id: latestClub._id.toString(),
        title: latestClub.name || 'Latest Club Event',
        date: clubDate,
        location: 'Club Room',
        description: clubDescription,
      });
    }
    return { data: events, success: true };
  }
}

export class GetUserInfoForDashboardUseCase implements IGetUserInfoForDashboardUseCase {
  constructor(private studentDashboardRepository: IStudentDashboardRepository) { }

  async execute(params: GetUserInfoRequestDTO): Promise<ResponseDTO<GetUserInfoResponseDTO>> {
    const userInfo = await this.studentDashboardRepository.getUserInfo(params.studentId);
    return { data: userInfo, success: true };
  }
} 