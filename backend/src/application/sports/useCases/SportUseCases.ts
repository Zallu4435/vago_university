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

export class GetSportsUseCase {
  constructor(private sportsRepository: ISportsRepository) { }

  async execute(params: GetSportsRequestDTO): Promise<GetSportsResponseDTO> {
    if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
      throw new Error("Invalid page or limit parameters");
    }
    // Additional filtering/validation can be added here as needed
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
    // Return the full sport document as is
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
      sport: new Sport({
        id: newSport._id?.toString() || newSport.id,
        title: newSport.title,
        type: newSport.type,
        headCoach: newSport.headCoach,
        playerCount: newSport.participants || 0,
        status: newSport.status === "active" ? SportStatus.Active : SportStatus.Inactive,
        formedOn: newSport.createdAt ? new Date(newSport.createdAt).toISOString() : undefined,
        logo: newSport.logo || "",
        division: newSport.division || "",
        participants: newSport.participants || 0,
        icon: newSport.icon,
        color: newSport.color,
        createdAt: newSport.createdAt,
        updatedAt: newSport.updatedAt,
      }),
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
      sport: new Sport({
        id: updatedSport._id?.toString() || updatedSport.id,
        title: updatedSport.title,
        type: updatedSport.type,
        headCoach: updatedSport.headCoach,
        playerCount: updatedSport.participants || 0,
        status: updatedSport.status === "active" ? SportStatus.Active : SportStatus.Inactive,
        formedOn: updatedSport.createdAt ? new Date(updatedSport.createdAt).toISOString() : undefined,
        logo: updatedSport.logo || "",
        division: updatedSport.division || "",
        participants: updatedSport.participants || 0,
        icon: updatedSport.icon,
        color: updatedSport.color,
        createdAt: updatedSport.createdAt,
        updatedAt: updatedSport.updatedAt,
      }),
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