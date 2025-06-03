import { ISportsRepository } from "../repositories/ISportsRepository";
import {
  GetSportRequestsRequestDTO,
  ApproveSportRequestRequestDTO,
  RejectSportRequestRequestDTO,
  GetSportRequestDetailsRequestDTO,
  JoinSportRequestDTO,
} from "../../../domain/sports/dtos/SportRequestDTOs";
import {
  GetSportRequestsResponseDTO,
  GetSportRequestDetailsResponseDTO,
  JoinSportResponseDTO,
} from "../../../domain/sports/dtos/SportResponseDTOs";
import mongoose from "mongoose";

export interface ResponseDTO<T> {
  success: boolean;
  data: T | { error: string };
}

export interface IGetSportRequestsUseCase {
  execute(params: GetSportRequestsRequestDTO): Promise<ResponseDTO<GetSportRequestsResponseDTO>>;
}

export interface IApproveSportRequestUseCase {
  execute(params: ApproveSportRequestRequestDTO): Promise<ResponseDTO<{ message: string }>>;
}

export interface IRejectSportRequestUseCase {
  execute(params: RejectSportRequestRequestDTO): Promise<ResponseDTO<{ message: string }>>;
}

export interface IGetSportRequestDetailsUseCase {
  execute(params: GetSportRequestDetailsRequestDTO): Promise<ResponseDTO<GetSportRequestDetailsResponseDTO>>;
}

export interface IJoinSportUseCase {
  execute(params: JoinSportRequestDTO): Promise<ResponseDTO<JoinSportResponseDTO>>;
}

export class GetSportRequestsUseCase implements IGetSportRequestsUseCase {
  constructor(private readonly sportsRepository: ISportsRepository) {}

  async execute(params: GetSportRequestsRequestDTO): Promise<ResponseDTO<GetSportRequestsResponseDTO>> {
    try {
      if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
        return { success: false, data: { error: "Invalid page or limit parameters" } };
      }
      const result = await this.sportsRepository.getSportRequests(params);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class ApproveSportRequestUseCase implements IApproveSportRequestUseCase {
  constructor(private readonly sportsRepository: ISportsRepository) {}

  async execute(params: ApproveSportRequestRequestDTO): Promise<ResponseDTO<{ message: string }>> {
    try {
      if (!mongoose.isValidObjectId(params.id)) {
        return { success: false, data: { error: "Invalid request ID" } };
      }
      await this.sportsRepository.approveSportRequest(params);
      return { success: true, data: { message: "Sport request approved successfully" } };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class RejectSportRequestUseCase implements IRejectSportRequestUseCase {
  constructor(private readonly sportsRepository: ISportsRepository) {}

  async execute(params: RejectSportRequestRequestDTO): Promise<ResponseDTO<{ message: string }>> {
    try {
      if (!mongoose.isValidObjectId(params.id)) {
        return { success: false, data: { error: "Invalid request ID" } };
      }
      await this.sportsRepository.rejectSportRequest(params);
      return { success: true, data: { message: "Sport request rejected successfully" } };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetSportRequestDetailsUseCase implements IGetSportRequestDetailsUseCase {
  constructor(private readonly sportsRepository: ISportsRepository) {}

  async execute(params: GetSportRequestDetailsRequestDTO): Promise<ResponseDTO<GetSportRequestDetailsResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.id)) {
        return { success: false, data: { error: "Invalid request ID" } };
      }
      const result = await this.sportsRepository.getSportRequestDetails(params);
      if (!result) {
        return { success: false, data: { error: "Sport request not found" } };
      }
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class JoinSportUseCase implements IJoinSportUseCase {
  constructor(private readonly sportsRepository: ISportsRepository) {}

  async execute(params: JoinSportRequestDTO): Promise<ResponseDTO<JoinSportResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.sportId)) {
        return { success: false, data: { error: "Invalid sport ID" } };
      }
      const result = await this.sportsRepository.joinSport(params);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
} 