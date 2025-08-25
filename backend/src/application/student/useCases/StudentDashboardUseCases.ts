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
  ResponseDTO
} from "../../../domain/student/dtos/StudentDashboardResponseDTOs";
import { IStudentDashboardRepository } from "../repositories/IStudentDashboardRepository";
import { IAssignmentDocument } from "../../../infrastructure/database/mongoose/assignment/AssignmentModel";
import { IVideoSession } from "../../../infrastructure/database/mongoose/session/session.model";
import { Event } from "../../../domain/events/entities/EventTypes";
import { Club } from "../../../domain/clubs/entities/ClubTypes";


interface CalendarData {
  events: Event[];
  sports: Record<string, unknown>[];
  clubs: Club[];
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
  constructor(private _studentDashboardRepository: IStudentDashboardRepository) { }

  async execute(): Promise<ResponseDTO<{ title: string; date: Date }[]>> {
    const [latestMessage, latestNotification] = await this._studentDashboardRepository.getAnnouncements();
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
  constructor(private _studentDashboardRepository: IStudentDashboardRepository) { }

  async execute(): Promise<GetDeadlinesResponseDTO> {
    const assignments: IAssignmentDocument[] = await this._studentDashboardRepository.getDeadlines();
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
  constructor(private _studentDashboardRepository: IStudentDashboardRepository) { }

  async execute(): Promise<GetClassesResponseDTO> {
    const sessionDocs: IVideoSession[] = await this._studentDashboardRepository.getClasses();
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
  constructor(private _studentDashboardRepository: IStudentDashboardRepository) { }

  async execute(): Promise<GetCalendarDaysResponseDTO> {
    const { events, sports, clubs }: CalendarData = await this._studentDashboardRepository.getCalendarDays();
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
      const sport = s as Record<string, unknown>;
      if (Array.isArray(sport.upcomingGames)) {
        (sport.upcomingGames as Array<{date: string, description: string}>).forEach(g => addEntry(g.date, 'sport', sport.title as string));
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
  constructor(private _studentDashboardRepository: IStudentDashboardRepository) { }

  async execute(): Promise<ResponseDTO<NewEventDTO[]>> {
    const [latestEvent, latestSport, latestClub] = await this._studentDashboardRepository.getNewEvents();
    const events: NewEventDTO[] = [];
    
    if (latestEvent) {
      const event = latestEvent as unknown as Event;
      events.push({
        id: event._id || '',
        title: event.title || 'Untitled Event',
        date: new Date(event.date),
        location: event.location || 'Campus',
        description: event.description || '',
      });
    }
    
    if (latestSport && typeof latestSport === 'object' && latestSport !== null) {
      const sport = latestSport as Record<string, unknown>;
      let sportDate = new Date(sport.createdAt as string || Date.now()).toISOString();
      let sportDescription = '';
      if (Array.isArray(sport.upcomingGames) && sport.upcomingGames.length > 0) {
        const sortedGames = [...sport.upcomingGames as Array<{date: string, description: string}>].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        sportDate = sortedGames[0].date;
        sportDescription = sortedGames[0].description || '';
      }
      events.push({
        id: (sport._id as string) || '',
        title: (sport.title as string) || 'Latest Sport Event',
        date: new Date(sportDate),
        location: (sport.homeGames as number)?.toString() || 'Sports Complex',
        description: sportDescription || (sport.division as string) || '',
      });
    }
    
    if (latestClub) {
      const club = latestClub as unknown as Club;
      let clubDate = new Date(club.createdAt);
      let clubDescription = club.about || '';
      if (Array.isArray(club.upcomingEvents) && club.upcomingEvents.length > 0) {
        const sortedEvents = [...club.upcomingEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        clubDate = new Date(sortedEvents[0].date);
        clubDescription = sortedEvents[0].description || clubDescription;
      }
      events.push({
        id: club._id || '',
        title: club.name || 'Latest Club Event',
        date: clubDate,
        location: 'Club Room',
        description: clubDescription,
      });
    }
    return { data: events, success: true };
  }
}

export class GetUserInfoForDashboardUseCase implements IGetUserInfoForDashboardUseCase {
  constructor(private _studentDashboardRepository: IStudentDashboardRepository) { }

  async execute(params: GetUserInfoRequestDTO): Promise<ResponseDTO<GetUserInfoResponseDTO>> {
    const userInfo = await this._studentDashboardRepository.getUserInfo(params.studentId);
    return { data: userInfo, success: true };
  }
} 