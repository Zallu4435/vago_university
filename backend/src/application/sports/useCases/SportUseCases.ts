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
import { Sport, SportDocument, SportStatus } from "../../../domain/sports/entities/SportTypes";

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
    const { sports, totalItems, totalPages, currentPage } = await this.sportsRepository.getSports(params.page, params.limit, params.sportType, params.status, params.coach, params.startDate, params.endDate, params.search);
    const mappedSports: SportSummaryDTO[] = sports.map((sport: SportDocument) => ({
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
    if (!params.id || typeof params.id !== 'string') {
      throw new Error("Invalid sport ID");
    }
    const sport = await this.sportsRepository.getById(params.id);
    if (!sport) {
      throw new Error("Sport not found");
    }
    return {
      sport: sport as unknown as Sport
    };
  }
}

export class CreateSportUseCase {
  constructor(private sportsRepository: ISportsRepository) { }

  async execute(params: CreateSportRequestDTO): Promise<CreateSportResponseDTO> {
    const normalizedParams = {
      ...params,
      status: (params.status && Object.values(SportStatus).includes(params.status as SportStatus))
        ? params.status as SportStatus
        : SportStatus.Active,
      category: params.category ?? "",
      organizer: params.organizer ?? "",
      organizerType: params.organizerType ?? "",
      icon: params.icon ?? "",
      color: params.color ?? "",
      division: params.division ?? "",
      headCoach: params.headCoach ?? "",
      homeGames: params.homeGames ?? 0,
      record: params.record ?? "",
      upcomingGames: params.upcomingGames ?? [],
      participants: params.participants ?? 0,
    };
    const newSport = await this.sportsRepository.create(normalizedParams);
    return { sport: newSport as unknown as Sport };
  }
}

export class UpdateSportUseCase {
  constructor(private sportsRepository: ISportsRepository) { }

  async execute(params: UpdateSportRequestDTO): Promise<UpdateSportResponseDTO> {
    if (!params.id || typeof params.id !== 'string') {
      throw new Error("Invalid sport ID");
    }
    const { id, ...updateData } = params;
    if (updateData.status) {
      updateData.status = updateData.status.toLowerCase() as SportStatus;
    }
    const updatedSport = await this.sportsRepository.updateById(id, { ...updateData, id });
    if (!updatedSport) {
      throw new Error("Sport not found");
    }
    return { sport: updatedSport as unknown as Sport };
  }
}

export class DeleteSportUseCase {
  constructor(private sportsRepository: ISportsRepository) { }

  async execute(params: DeleteSportRequestDTO): Promise<{ message: string }> {
    if (!params.id || typeof params.id !== 'string') {
      throw new Error("Invalid sport ID");
    }
    await this.sportsRepository.deleteById(params.id);
    return { message: "Sport deleted successfully" };
  }
} 