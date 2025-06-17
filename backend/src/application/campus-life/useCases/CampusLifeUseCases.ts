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
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) {}

  async execute(params: GetCampusLifeOverviewRequestDTO): Promise<ResponseDTO<CampusLifeOverviewResponseDTO>> {
    try {
      const result = await this.campusLifeRepository.getCampusLifeOverview(params);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetEventsUseCase implements IGetEventsUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) {}

  async execute(params: GetEventsRequestDTO): Promise<ResponseDTO<GetEventsResponseDTO>> {
    try {
      if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
        return { success: false, data: { error: "Invalid page or limit parameters" } };
      }
      if (params.status && !['upcoming', 'past', 'all'].includes(params.status)) {
        return { success: false, data: { error: "Invalid status; must be 'upcoming', 'past', or 'all'" } };
      }
      const result = await this.campusLifeRepository.getEvents(params);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetEventByIdUseCase implements IGetEventByIdUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) {}

  async execute(params: GetEventByIdRequestDTO): Promise<ResponseDTO<GetEventByIdResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.eventId)) {
        return { success: false, data: { error: "Invalid event ID" } };
      }
      const result = await this.campusLifeRepository.getEventById(params);
      if (!result) {
        return { success: false, data: { error: "Event not found" } };
      }
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetSportsUseCase implements IGetSportsUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) {}

  async execute(params: GetSportsRequestDTO): Promise<ResponseDTO<GetSportsResponseDTO>> {
    try {
      if (params.type && !['VARSITY SPORTS', 'INTRAMURAL SPORTS'].includes(params.type)) {
        return { success: false, data: { error: "Invalid type; must be 'VARSITY SPORTS' or 'INTRAMURAL SPORTS'" } };
      }
      const result = await this.campusLifeRepository.getSports(params);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetSportByIdUseCase implements IGetSportByIdUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) {}

  async execute(params: GetSportByIdRequestDTO): Promise<ResponseDTO<GetSportByIdResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.sportId)) {
        return { success: false, data: { error: "Invalid sport ID" } };
      }
      const result = await this.campusLifeRepository.getSportById(params);
      if (!result) {
        return { success: false, data: { error: "Sport not found" } };
      }
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetClubsUseCase implements IGetClubsUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) {}

  async execute(params: GetClubsRequestDTO): Promise<ResponseDTO<GetClubsResponseDTO>> {
    try {
      if (params.status && !['active', 'inactive', 'all'].includes(params.status)) {
        return { success: false, data: { error: "Invalid status; must be 'active', 'inactive', or 'all'" } };
      }
      const result = await this.campusLifeRepository.getClubs(params);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetClubByIdUseCase implements IGetClubByIdUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) {}

  async execute(params: GetClubByIdRequestDTO): Promise<ResponseDTO<GetClubByIdResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.clubId)) {
        return { success: false, data: { error: "Invalid club ID" } };
      }
      const result = await this.campusLifeRepository.getClubById(params);
      if (!result) {
        return { success: false, data: { error: "Club not found" } };
      }
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class JoinClubUseCase implements IJoinClubUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) {}

  async execute(params: JoinClubRequestDTO): Promise<ResponseDTO<JoinClubResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.clubId) || !mongoose.isValidObjectId(params.studentId)) {
        return { success: false, data: { error: "Invalid club or student ID" } };
      }
      if (!params.reason) {
        return { success: false, data: { error: "Reason is required" } };
      }
      const result = await this.campusLifeRepository.joinClub(params);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class JoinSportUseCase implements IJoinSportUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) {}

  async execute(params: JoinSportRequestDTO): Promise<ResponseDTO<JoinSportResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.sportId) || !mongoose.isValidObjectId(params.studentId)) {
        return { success: false, data: { error: "Invalid sport or student ID" } };
      }
      if (!params.reason) {
        return { success: false, data: { error: "Reason is required" } };
      }
      const result = await this.campusLifeRepository.joinSport(params);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class JoinEventUseCase implements IJoinEventUseCase {
  constructor(private readonly campusLifeRepository: ICampusLifeRepository) {}

  async execute(params: JoinEventRequestDTO): Promise<ResponseDTO<JoinEventResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.eventId) || !mongoose.isValidObjectId(params.studentId)) {
        return { success: false, data: { error: "Invalid event or student ID" } };
      }
      if (!params.reason) {
        return { success: false, data: { error: "Reason is required" } };
      }
      const result = await this.campusLifeRepository.joinEvent(params);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}