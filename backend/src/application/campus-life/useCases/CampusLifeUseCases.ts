import { ICampusLifeRepository } from "../repositories/ICampusLifeRepository";
import {
  GetCampusLifeOverviewRequestDTO,
  GetEventsRequestDTO,
  GetEventByIdRequestDTO,
  GetSportsRequestDTO,
  GetSportByIdRequestDTO,
  GetClubsRequestDTO,
  GetClubByIdRequestDTO,
  JoinClubRequestDTO,
  JoinSportRequestDTO,
  JoinEventRequestDTO,
  CampusLifeOverviewResponseDTO,
  GetEventsResponseDTO,
  GetEventByIdResponseDTO,
  GetSportsResponseDTO,
  GetSportByIdResponseDTO,
  GetClubsResponseDTO,
  GetClubByIdResponseDTO,
  JoinClubResponseDTO,
  JoinSportResponseDTO,
  JoinEventResponseDTO,
  ResponseDTO
} from "../../../domain/campus-life/dtos/CampusLifeDTOs";
import { CampusEvent, Sport, Club, ClubStatus, SportType } from "../../../domain/campus-life/entities/CampusLife";

export interface IGetCampusLifeOverviewUseCase {
  execute(params: GetCampusLifeOverviewRequestDTO): Promise<ResponseDTO<CampusLifeOverviewResponseDTO>>;
}

export interface IGetEventsUseCase {
  execute(params: GetEventsRequestDTO): Promise<ResponseDTO<GetEventsResponseDTO>>;
}

export interface IGetEventByIdUseCase {
  execute(params: GetEventByIdRequestDTO): Promise<ResponseDTO<GetEventByIdResponseDTO>>;
}

export interface IGetSportsUseCase {
  execute(params: GetSportsRequestDTO): Promise<ResponseDTO<GetSportsResponseDTO>>;
}

export interface IGetSportByIdUseCase {
  execute(params: GetSportByIdRequestDTO): Promise<ResponseDTO<GetSportByIdResponseDTO>>;
}

export interface IGetClubsUseCase {
  execute(params: GetClubsRequestDTO): Promise<ResponseDTO<GetClubsResponseDTO>>;
}

export interface IGetClubByIdUseCase {
  execute(params: GetClubByIdRequestDTO): Promise<ResponseDTO<GetClubByIdResponseDTO>>;
}

export interface IJoinClubUseCase {
  execute(params: JoinClubRequestDTO): Promise<ResponseDTO<JoinClubResponseDTO>>;
}

export interface IJoinSportUseCase {
  execute(params: JoinSportRequestDTO): Promise<ResponseDTO<JoinSportResponseDTO>>;
}

export interface IJoinEventUseCase {
  execute(params: JoinEventRequestDTO): Promise<ResponseDTO<JoinEventResponseDTO>>;
}


export class GetCampusLifeOverviewUseCase implements IGetCampusLifeOverviewUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) { }

  async execute(params: GetCampusLifeOverviewRequestDTO): Promise<ResponseDTO<CampusLifeOverviewResponseDTO>> {
    const { events, sports, clubs } = await this.campusLifeRepository.getCampusLifeOverview(params);
    return {
      success: true,
      data: {
        events: events.map((e) => new CampusEvent(
          e._id.toString(),
          e.title,
          e.date,
          e.time,
          e.location,
          e.organizer,
          e.timeframe,
          e.icon,
          e.color,
          e.description,
          String(e.fullTime), 
          e.additionalInfo,
          e.requirements,
          e.createdAt.toISOString(),
          e.updatedAt.toISOString()
        )),
        sports: sports.map((s) => new Sport(
          s._id.toString(),
          s.title,
          s.type as SportType,
          [],
          s.icon,
          s.color,
          s.division,
          s.headCoach,
          [],
          "",
          [],
          s.createdAt.toISOString(),
          s.updatedAt.toISOString()
        )),
        clubs: clubs.map((c) => new Club(
          c._id.toString(),
          c.name,
          c.type,
          Array.isArray(c.members) ? c.members.length : 0,
          c.icon,
          c.color,
          c.status as ClubStatus,
          "",
          c.nextMeeting,
          c.about || "",
          c.upcomingEvents || [],
          c.createdAt.toISOString(),
          c.updatedAt.toISOString()
        ))
      }
    };
  }
}

export class GetEventsUseCase implements IGetEventsUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) { }

  async execute(params: GetEventsRequestDTO): Promise<ResponseDTO<GetEventsResponseDTO>> {
    if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
      return { success: false, data: { error: "Invalid page or limit parameters" } };
    }
    if (params.status && !['upcoming', 'past', 'all'].includes(params.status)) {
      return { success: false, data: { error: "Invalid status; must be 'upcoming', 'past', or 'all'" } };
    }
    const { events: rawEvents, requests, totalItems, totalPages, currentPage } = await this.campusLifeRepository.getEvents(params);
    return {
      success: true,
      data: {
        events: rawEvents.map((e) => {
          const req = requests.find((r) => r.eventId?.toString() === e._id.toString());
          return new CampusEvent(
            e._id.toString(),
            e.title,
            e.date,
            e.time,
            e.location,
            e.organizer,
            e.timeframe,
            e.icon,
            e.color,
            e.description,
            String(e.fullTime), 
            e.additionalInfo,
            e.requirements,
            e.createdAt.toISOString(),
            e.updatedAt.toISOString(),
            req ? req.status as 'pending' | 'approved' | 'rejected' : null
          );
        }),
        totalItems,
        totalPages,
        currentPage,
      }
    };
  }
}

export class GetEventByIdUseCase implements IGetEventByIdUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) { }

  async execute(params: GetEventByIdRequestDTO): Promise<ResponseDTO<GetEventByIdResponseDTO>> {
    const rawEvent = await this.campusLifeRepository.getEventById(params.eventId);
    if (!rawEvent) {
      return { success: false, data: { error: "Event not found" } };
    }
    return {
      success: true,
      data: {
        event: new CampusEvent(
          rawEvent._id.toString(),
          rawEvent.title,
          rawEvent.date,
          rawEvent.time,
          rawEvent.location,
          rawEvent.organizer,
          rawEvent.timeframe,
          rawEvent.icon,
          rawEvent.color,
          rawEvent.description,
          String(rawEvent.fullTime), 
          rawEvent.additionalInfo,
          rawEvent.requirements,
          rawEvent.createdAt.toString(),
          rawEvent.updatedAt.toString()
        )
      }
    };
  }
}

export class GetSportsUseCase implements IGetSportsUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) { }

  async execute(params: GetSportsRequestDTO): Promise<ResponseDTO<GetSportsResponseDTO>> {
    if (params.type && !['VARSITY SPORTS', 'INTRAMURAL SPORTS'].includes(params.type)) {
      return { success: false, data: { error: "Invalid type; must be 'VARSITY SPORTS' or 'INTRAMURAL SPORTS'" } };
    }
    const { sports, requests, totalItems } = await this.campusLifeRepository.getSports(params);
    return {
      success: true,
      data: {
        sports: sports.map((s) => {
          const req = requests.find((r) => r.sportId?.toString() === s._id.toString());
          return new Sport(
            s._id.toString(),
            s.title,
            s.type as SportType,
            [],
            s.icon,
            s.color,
            s.division,
            s.headCoach,
            [],
            "",
            [],
            s.createdAt.toISOString(),
            s.updatedAt.toISOString(),
            req ? req.status as 'pending' | 'approved' | 'rejected' : null
          );
        }),
        totalItems
      }
    };
  }
}

export class GetSportByIdUseCase implements IGetSportByIdUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) { }

  async execute(params: GetSportByIdRequestDTO): Promise<ResponseDTO<GetSportByIdResponseDTO>> {
    const sport = await this.campusLifeRepository.getSportById(params.sportId);
    if (!sport) {
      return { success: false, data: { error: "Sport not found" } };
    }
    return {
      success: true,
      data: {
        sport: new Sport(
          sport._id.toString(),
          sport.title,
          sport.type as SportType,
          [],
          sport.icon,
          sport.color,
          sport.division,
          sport.headCoach,
          [],
          "",
          [],
          sport.createdAt.toString(),
          sport.updatedAt.toString()
        )
      }
    };
  }
}

export class GetClubsUseCase implements IGetClubsUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) { }

  async execute(params: GetClubsRequestDTO): Promise<ResponseDTO<GetClubsResponseDTO>> {
    if (params.status && !['active', 'inactive', 'all'].includes(params.status)) {
      return { success: false, data: { error: "Invalid status; must be 'active', 'inactive', or 'all'" } };
    }
    const { clubs, requests, totalItems } = await this.campusLifeRepository.getClubs(params);
    return {
      success: true,
      data: {
        clubs: clubs.map((c) => {
          const req = requests.find((r) => r.clubId?.toString() === c._id.toString());
          return new Club(
            c._id.toString(),
            c.name,
            c.type,
            Array.isArray(c.members) ? c.members.length : 0,
            c.icon,
            c.color,
            c.status as ClubStatus,
            "",
            c.nextMeeting,
            c.about || "",
            c.upcomingEvents || [],
            c.createdAt.toISOString(),
            c.updatedAt.toISOString(),
            req ? req.status as 'pending' | 'approved' | 'rejected' : null
          );
        }),
        totalItems
      }
    };
  }
}

export class GetClubByIdUseCase implements IGetClubByIdUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) { }

  async execute(params: GetClubByIdRequestDTO): Promise<ResponseDTO<GetClubByIdResponseDTO>> {
    const club = await this.campusLifeRepository.getClubById(params.clubId);
    if (!club) {
      return { success: false, data: { error: "Club not found" } };
    }
    return {
      success: true,
      data: {
        club: new Club(
          club._id.toString(),
          club.name,
          club.type,
          Array.isArray(club.members) ? club.members.length : 0,
          club.icon,
          club.color,
          club.status as ClubStatus,
          "",
          club.nextMeeting,
          club.about || "",
          club.upcomingEvents || [],
          club.createdAt.toString(),
          club.updatedAt.toString()
        )
      }
    };
  }
}

export class JoinClubUseCase implements IJoinClubUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) { }

  async execute(params: JoinClubRequestDTO): Promise<ResponseDTO<JoinClubResponseDTO>> {
    if (!params.reason) {
      return { success: false, data: { error: "Reason is required" } };
    }
    const newRequest = await this.campusLifeRepository.joinClub(params);
    return {
      success: true,
      data: {
        requestId: newRequest._id.toString(),
        status: newRequest.status as 'pending' | 'approved' | 'rejected',
        message: "Join request submitted successfully"
      }
    };
  }
}

export class JoinSportUseCase implements IJoinSportUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) { }

  async execute(params: JoinSportRequestDTO): Promise<ResponseDTO<JoinSportResponseDTO>> {
    if (!params.reason) {
      return { success: false, data: { error: "Reason is required" } };
    }
    const newRequest = await this.campusLifeRepository.joinSport(params);
    return {
      success: true,
      data: {
        requestId: newRequest._id.toString(),
        status: newRequest.status as 'pending' | 'approved' | 'rejected',
        message: "Join request submitted successfully"
      }
    };
  }
}

export class JoinEventUseCase implements IJoinEventUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) { }

  async execute(params: JoinEventRequestDTO): Promise<ResponseDTO<JoinEventResponseDTO>> {
    if (!params.reason) {
      return { success: false, data: { error: "Reason is required" } };
    }
    const newRequest = await this.campusLifeRepository.joinEvent(params);
    return {
      success: true,
      data: {
        requestId: newRequest._id.toString(),
        status: newRequest.status as 'pending' | 'approved' | 'rejected',
        message: "Join request submitted successfully"
      }
    };
  }
}