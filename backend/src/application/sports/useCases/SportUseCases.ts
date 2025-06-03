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
} from "../../../domain/sports/dtos/SportResponseDTOs";
import mongoose from "mongoose";

export interface ResponseDTO<T> {
  success: boolean;
  data: T | { error: string };
}

export interface IGetSportsUseCase {
  execute(params: GetSportsRequestDTO): Promise<ResponseDTO<GetSportsResponseDTO>>;
}

export interface IGetSportByIdUseCase {
  execute(params: GetSportByIdRequestDTO): Promise<ResponseDTO<GetSportByIdResponseDTO>>;
}

export interface ICreateSportUseCase {
  execute(params: CreateSportRequestDTO): Promise<ResponseDTO<CreateSportResponseDTO>>;
}

export interface IUpdateSportUseCase {
  execute(params: UpdateSportRequestDTO): Promise<ResponseDTO<UpdateSportResponseDTO>>;
}

export interface IDeleteSportUseCase {
  execute(params: DeleteSportRequestDTO): Promise<ResponseDTO<{ message: string }>>;
}

export class GetSportsUseCase implements IGetSportsUseCase {
  constructor(private readonly sportsRepository: ISportsRepository) {}

  async execute(params: GetSportsRequestDTO): Promise<ResponseDTO<GetSportsResponseDTO>> {
    try {
      if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
        return { success: false, data: { error: "Invalid page or limit parameters" } };
      }
      const result = await this.sportsRepository.getSports(params);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetSportByIdUseCase implements IGetSportByIdUseCase {
  constructor(private readonly sportsRepository: ISportsRepository) {}

  async execute(params: GetSportByIdRequestDTO): Promise<ResponseDTO<GetSportByIdResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.id)) {
        return { success: false, data: { error: "Invalid sport ID" } };
      }
      const result = await this.sportsRepository.getSportById(params);
      if (!result) {
        return { success: false, data: { error: "Sport not found" } };
      }
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class CreateSportUseCase implements ICreateSportUseCase {
  constructor(private readonly sportsRepository: ISportsRepository) {}

  async execute(params: CreateSportRequestDTO): Promise<ResponseDTO<CreateSportResponseDTO>> {
    try {
      const result = await this.sportsRepository.createSport(params);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class UpdateSportUseCase implements IUpdateSportUseCase {
  constructor(private readonly sportsRepository: ISportsRepository) {}

  async execute(params: UpdateSportRequestDTO): Promise<ResponseDTO<UpdateSportResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.id)) {
        return { success: false, data: { error: "Invalid sport ID" } };
      }
      const result = await this.sportsRepository.updateSport(params);
      if (!result) {
        return { success: false, data: { error: "Sport not found" } };
      }
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class DeleteSportUseCase implements IDeleteSportUseCase {
  constructor(private readonly sportsRepository: ISportsRepository) {}

  async execute(params: DeleteSportRequestDTO): Promise<ResponseDTO<{ message: string }>> {
    try {
      if (!mongoose.isValidObjectId(params.id)) {
        return { success: false, data: { error: "Invalid sport ID" } };
      }
      await this.sportsRepository.deleteSport(params);
      return { success: true, data: { message: "Sport deleted successfully" } };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
} 