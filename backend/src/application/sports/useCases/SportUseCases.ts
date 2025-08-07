import { ISportsRepository } from "../repositories/ISportsRepository";
import {
  GetSportsRequestDTO,
  GetSportByIdRequestDTO,
  CreateSportRequestDTO,
  UpdateSportRequestDTO,
  DeleteSportRequestDTO,
} from "../../../domain/sports/dtos/SportRequestDTOs";
import {
  GetSportsResponseDTO,
  GetSportByIdResponseDTO,
  CreateSportResponseDTO,
  UpdateSportResponseDTO,
  SportSummaryDTO,
} from "../../../domain/sports/dtos/SportResponseDTOs";
import { SportStatus } from "../../../domain/sports/entities/SportTypes";
import { Sport } from "../../../domain/sports/entities/Sport";
import mongoose from "mongoose";

export interface IGetSportsUseCase {
  execute(params: GetSportsRequestDTO): Promise<GetSportsResponseDTO>;
}

export interface IGetSportByIdUseCase {
  execute(params: GetSportByIdRequestDTO): Promise<GetSportByIdResponseDTO>;
}

export interface ICreateSportUseCase {
  execute(params: CreateSportRequestDTO): Promise<CreateSportResponseDTO>;
}

export interface IUpdateSportUseCase {
  execute(params: UpdateSportRequestDTO): Promise<UpdateSportResponseDTO>;
}

export interface IDeleteSportUseCase {
  execute(params: DeleteSportRequestDTO): Promise<{ message: string }>;
}

export class GetSportsUseCase {
  constructor(private sportsRepository: ISportsRepository) { }

  async execute(params: GetSportsRequestDTO): Promise<GetSportsResponseDTO> {
    if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
      throw new Error("Invalid page or limit parameters");
    }
    const { sports, totalItems, totalPages, currentPage } = await this.sportsRepository.getSports(params);
    const mappedSports: SportSummaryDTO[] = sports.map((sport: any) => ({
      id: sport._id?.toString() || sport.id,
      title: sport.title,
      type: sport.type,
      headCoach: sport.headCoach,
      playerCount: sport.participants || 0,
      status: sport.status,
      formedOn: sport.createdAt ? new Date(sport.createdAt).toISOString() : undefined,
      logo: sport.logo || "",
      division: sport.division || "",
      participants: sport.participants || 0,
      icon: sport.icon,
      color: sport.color,
      createdAt: sport.createdAt ? new Date(sport.createdAt).toISOString() : undefined
    }));
    return {
      sports: mappedSports,
      data: mappedSports,
      totalItems,
      totalPages,
      currentPage,
    };
  }
}

export class GetSportByIdUseCase {
  constructor(private sportsRepository: ISportsRepository) { }

  async execute(params: GetSportByIdRequestDTO): Promise<GetSportByIdResponseDTO> {
    if (!mongoose.isValidObjectId(params.id)) {
      throw new Error("Invalid sport ID");
    }
    const sport: any = await this.sportsRepository.getSportById(params);
    if (!sport) {
      throw new Error("Sport not found");
    }
    return {
      sport: sport
    };
  }
}

export class CreateSportUseCase {
  constructor(private sportsRepository: ISportsRepository) { }

  async execute(params: CreateSportRequestDTO): Promise<CreateSportResponseDTO> {
    const newSport: any = await this.sportsRepository.createSport(params);
    
    return {
      sport: {
        id: newSport._id?.toString() || newSport.id,
        title: newSport.title,
        type: newSport.type,
        category: newSport.category,
        organizer: newSport.organizer,
        organizerType: newSport.organizerType,
        icon: newSport.icon,
        color: newSport.color,
        division: newSport.division,
        headCoach: newSport.headCoach,
        homeGames: newSport.homeGames,
        record: newSport.record,
        upcomingGames: newSport.upcomingGames,
        participants: newSport.participants,
        status: newSport.status === "active" ? SportStatus.Active : SportStatus.Inactive,
        createdAt: newSport.createdAt,
        updatedAt: newSport.updatedAt,
      },
    };
  }
}

export class UpdateSportUseCase {
  constructor(private sportsRepository: ISportsRepository) { }

  async execute(params: UpdateSportRequestDTO): Promise<UpdateSportResponseDTO> {
    if (!mongoose.isValidObjectId(params.id)) {
      throw new Error("Invalid sport ID");
    }
    const updatedSport: any = await this.sportsRepository.updateSport(params);
    if (!updatedSport) {
      throw new Error("Sport not found");
    }
    return {
      sport: {
        id: updatedSport._id?.toString() || updatedSport.id,
        title: updatedSport.title,
        type: updatedSport.type,
        category: updatedSport.category,
        organizer: updatedSport.organizer,
        organizerType: updatedSport.organizerType,
        icon: updatedSport.icon,
        color: updatedSport.color,
        division: updatedSport.division,
        headCoach: updatedSport.headCoach,
        homeGames: updatedSport.homeGames,
        record: updatedSport.record,
        upcomingGames: updatedSport.upcomingGames,
        participants: updatedSport.participants,
        status: updatedSport.status === "active" ? SportStatus.Active : SportStatus.Inactive,
        createdAt: updatedSport.createdAt,
        updatedAt: updatedSport.updatedAt,
      },
    };
  }
}

export class DeleteSportUseCase {
  constructor(private sportsRepository: ISportsRepository) { }

  async execute(params: DeleteSportRequestDTO): Promise<{ message: string }> {
    if (!mongoose.isValidObjectId(params.id)) {
      throw new Error("Invalid sport ID");
    }
    await this.sportsRepository.deleteSport(params);
    return { message: "Sport deleted successfully" };
  }
} 