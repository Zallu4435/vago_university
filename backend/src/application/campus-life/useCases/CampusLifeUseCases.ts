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
} from "../../../domain/campus-life/dtos/CampusLifeDTOs";
import mongoose from "mongoose";

export interface ResponseDTO<T> {
  success: boolean;
  data: T | { error: string };
}

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
    try {
      const { events, sports, clubs } = await this.campusLifeRepository.getCampusLifeOverview(params);
      const CampusEvent = require("../../../domain/campus-life/entities/CampusLife").CampusEvent;
      const Sport = require("../../../domain/campus-life/entities/CampusLife").Sport;
      const Club = require("../../../domain/campus-life/entities/CampusLife").Club;
      return {
        success: true,
        data: {
          events: events.map((e: any) => new CampusEvent(
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
            e.fullTime,
            e.additionalInfo,
            e.requirements,
            e.createdAt.toISOString(),
            e.updatedAt.toISOString()
          )),
          sports: sports.map((s: any) => new Sport(
            s._id.toString(),
            s.title,
            s.type,
            [],
            s.icon,
            s.color,
            s.division,
            s.headCoach,
            [s.homeGames?.toString() || ""],
            s.record,
            s.upcomingGames?.map((g: any) => g.description) || [],
            s.createdAt.toISOString(),
            s.updatedAt.toISOString()
          )),
          clubs: clubs.map((c: any) => new Club(
            c._id.toString(),
            c.name,
            c.type,
            parseInt(c.members) || 0,
            c.icon,
            c.color,
            c.status,
            c.role,
            c.nextMeeting,
            c.about,
            c.upcomingEvents?.map((e: any) => e.description) || [],
            c.createdAt.toISOString(),
            c.updatedAt.toISOString()
          ))
        }
      };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetEventsUseCase implements IGetEventsUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) { }

  async execute(params: GetEventsRequestDTO): Promise<ResponseDTO<GetEventsResponseDTO>> {
    try {
      if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
        return { success: false, data: { error: "Invalid page or limit parameters" } };
      }
      if (params.status && !['upcoming', 'past', 'all'].includes(params.status)) {
        return { success: false, data: { error: "Invalid status; must be 'upcoming', 'past', or 'all'" } };
      }
      const { events: rawEvents, requests, totalItems, totalPages, currentPage } = await this.campusLifeRepository.getEvents(params);
      const CampusEvent = require("../../../domain/campus-life/entities/CampusLife").CampusEvent;
      return {
        success: true,
        data: {
          events: rawEvents.map((e: any) => {
            const req = requests.find((r: any) => r.eventId.toString() === e._id.toString());
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
              e.fullTime,
              e.additionalInfo,
              e.requirements,
              e.createdAt.toISOString(),
              e.updatedAt.toISOString(),
              req ? req.status : null
            );
          }),
          totalItems,
          totalPages,
          currentPage,
        }
      };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetEventByIdUseCase implements IGetEventByIdUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) { }

  async execute(params: GetEventByIdRequestDTO): Promise<ResponseDTO<GetEventByIdResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.eventId)) {
        return { success: false, data: { error: "Invalid event ID" } };
      }
      const rawEvent = await this.campusLifeRepository.getEventById(params);
      if (!rawEvent) {
        return { success: false, data: { error: "Event not found" } };
      }
      const CampusEvent = require("../../../domain/campus-life/entities/CampusLife").CampusEvent;
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
            rawEvent.fullTime,
            rawEvent.additionalInfo,
            rawEvent.requirements,
            rawEvent.createdAt.toISOString(),
            rawEvent.updatedAt.toISOString()
          )
        }
      };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetSportsUseCase implements IGetSportsUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) { }

  async execute(params: GetSportsRequestDTO): Promise<ResponseDTO<GetSportsResponseDTO>> {
    try {
      if (params.type && !['VARSITY SPORTS', 'INTRAMURAL SPORTS'].includes(params.type)) {
        return { success: false, data: { error: "Invalid type; must be 'VARSITY SPORTS' or 'INTRAMURAL SPORTS'" } };
      }
      const { sports, requests, totalItems } = await this.campusLifeRepository.getSports(params);
      const Sport = require("../../../domain/campus-life/entities/CampusLife").Sport;
      return {
        success: true,
        data: {
          sports: sports.map((s: any) => {
            const req = requests.find(r => r.sportId.toString() === s._id.toString());
            return new Sport(
              s._id.toString(),
              s.title,
              s.type,
              [],
              s.icon,
              s.color,
              s.division,
              s.headCoach,
              [s.homeGames?.toString() || ""],
              s.record,
              s.upcomingGames?.map((g: any) => g.description) || [],
              s.createdAt.toISOString(),
              s.updatedAt.toISOString(),
              req ? req.status : null
            );
          }),
          totalItems
        }
      };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetSportByIdUseCase implements IGetSportByIdUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) { }

  async execute(params: GetSportByIdRequestDTO): Promise<ResponseDTO<GetSportByIdResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.sportId)) {
        return { success: false, data: { error: "Invalid sport ID" } };
      }
      const sport = await this.campusLifeRepository.getSportById(params);
      if (!sport) {
        return { success: false, data: { error: "Sport not found" } };
      }
      const Sport = require("../../../domain/campus-life/entities/CampusLife").Sport;
      return {
        success: true,
        data: {
          sport: new Sport(
            sport._id.toString(),
            sport.title,
            sport.type,
            [],
            sport.icon,
            sport.color,
            sport.division,
            sport.headCoach,
            [sport.homeGames?.toString() || ""],
            sport.record,
            sport.upcomingGames?.map((g: any) => g.description) || [],
            sport.createdAt.toISOString(),
            sport.updatedAt.toISOString()
          )
        }
      };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetClubsUseCase implements IGetClubsUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) { }

  async execute(params: GetClubsRequestDTO): Promise<ResponseDTO<GetClubsResponseDTO>> {
    try {
      if (params.status && !['active', 'inactive', 'all'].includes(params.status)) {
        return { success: false, data: { error: "Invalid status; must be 'active', 'inactive', or 'all'" } };
      }
      const { clubs, requests, totalItems } = await this.campusLifeRepository.getClubs(params);
      const Club = require("../../../domain/campus-life/entities/CampusLife").Club;
      return {
        success: true,
        data: {
          clubs: clubs.map((c: any) => {
            const req = requests.find(r => r.clubId.toString() === c._id.toString());
            return new Club(
              c._id.toString(),
              c.name,
              c.type,
              parseInt(c.members) || 0,
              c.icon,
              c.color,
              c.status,
              c.role,
              c.nextMeeting,
              c.about,
              c.upcomingEvents?.map((e: any) => e.description) || [],
              c.createdAt.toISOString(),
              c.updatedAt.toISOString(),
              req ? req.status : null
            );
          }),
          totalItems
        }
      };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetClubByIdUseCase implements IGetClubByIdUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) { }

  async execute(params: GetClubByIdRequestDTO): Promise<ResponseDTO<GetClubByIdResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.clubId)) {
        return { success: false, data: { error: "Invalid club ID" } };
      }
      const club = await this.campusLifeRepository.getClubById(params);
      if (!club) {
        return { success: false, data: { error: "Club not found" } };
      }
      const Club = require("../../../domain/campus-life/entities/CampusLife").Club;
      return {
        success: true,
        data: {
          club: new Club(
            club._id.toString(),
            club.name,
            club.type,
            parseInt(club.members) || 0,
            club.icon,
            club.color,
            club.status,
            club.role,
            club.nextMeeting,
            club.about,
            club.upcomingEvents?.map((e: any) => e.description) || [],
            club.createdAt.toISOString(),
            club.updatedAt.toISOString()
          )
        }
      };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class JoinClubUseCase implements IJoinClubUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) { }

  async execute(params: JoinClubRequestDTO): Promise<ResponseDTO<JoinClubResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.clubId) || !mongoose.isValidObjectId(params.studentId)) {
        return { success: false, data: { error: "Invalid club or student ID" } };
      }
      if (!params.reason) {
        return { success: false, data: { error: "Reason is required" } };
      }
      // Check for existing request, club, and user in the use case if needed
      // For now, just create the request
      const newRequest = await this.campusLifeRepository.joinClub(params);
      return {
        success: true,
        data: {
          requestId: newRequest._id.toString(),
          status: newRequest.status,
          message: "Join request submitted successfully"
        }
      };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class JoinSportUseCase implements IJoinSportUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) { }

  async execute(params: JoinSportRequestDTO): Promise<ResponseDTO<JoinSportResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.sportId) || !mongoose.isValidObjectId(params.studentId)) {
        return { success: false, data: { error: "Invalid sport or student ID" } };
      }
      if (!params.reason) {
        return { success: false, data: { error: "Reason is required" } };
      }
      // Check for existing request, sport, and user in the use case if needed
      // For now, just create the request
      const newRequest = await this.campusLifeRepository.joinSport(params);
      return {
        success: true,
        data: {
          requestId: newRequest._id.toString(),
          status: newRequest.status,
          message: "Join request submitted successfully"
        }
      };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class JoinEventUseCase implements IJoinEventUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) { }

  async execute(params: JoinEventRequestDTO): Promise<ResponseDTO<JoinEventResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.eventId) || !mongoose.isValidObjectId(params.studentId)) {
        return { success: false, data: { error: "Invalid event or student ID" } };
      }
      if (!params.reason) {
        return { success: false, data: { error: "Reason is required" } };
      }
      // Check for existing request, event, and user in the use case if needed
      // For now, just create the request
      const newRequest = await this.campusLifeRepository.joinEvent(params);
      return {
        success: true,
        data: {
          requestId: newRequest._id.toString(),
          status: newRequest.status,
          message: "Join request submitted successfully"
        }
      };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}