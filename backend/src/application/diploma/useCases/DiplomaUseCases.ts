import { IDiplomaRepository } from "../repositories/IDiplomaRepository";
import { GetDiplomasRequestDTO, GetDiplomaByIdRequestDTO, CreateDiplomaRequestDTO, UpdateDiplomaRequestDTO, DeleteDiplomaRequestDTO } from "../../../domain/diploma/dtos/DiplomaRequestDTOs";
import { GetDiplomasResponseDTO, GetDiplomaByIdResponseDTO, CreateDiplomaResponseDTO, UpdateDiplomaResponseDTO } from "../../../domain/diploma/dtos/DiplomaResponseDTOs";
import mongoose from "mongoose";

interface ResponseDTO<T> {
  data: T | { error: string };
  success: boolean;
}

export interface IGetDiplomasUseCase {
  execute(params: GetDiplomasRequestDTO): Promise<ResponseDTO<GetDiplomasResponseDTO>>;
}

export interface IGetDiplomaByIdUseCase {
  execute(params: GetDiplomaByIdRequestDTO): Promise<ResponseDTO<GetDiplomaByIdResponseDTO>>;
}

export interface ICreateDiplomaUseCase {
  execute(params: CreateDiplomaRequestDTO): Promise<ResponseDTO<CreateDiplomaResponseDTO>>;
}

export interface IUpdateDiplomaUseCase {
  execute(params: UpdateDiplomaRequestDTO): Promise<ResponseDTO<UpdateDiplomaResponseDTO>>;
}

export interface IDeleteDiplomaUseCase {
  execute(params: DeleteDiplomaRequestDTO): Promise<ResponseDTO<{ message: string }>>;
}

export class GetDiplomasUseCase implements IGetDiplomasUseCase {
  constructor(private readonly diplomaRepository: IDiplomaRepository) { }

  async execute(params: GetDiplomasRequestDTO): Promise<ResponseDTO<GetDiplomasResponseDTO>> {
    try {
      if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
        return { success: false, data: { error: "Invalid page or limit parameters" } };
      }
      const result = await this.diplomaRepository.getDiplomas(params);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetDiplomaByIdUseCase implements IGetDiplomaByIdUseCase {
  constructor(private readonly diplomaRepository: IDiplomaRepository) { }

  async execute(params: GetDiplomaByIdRequestDTO): Promise<ResponseDTO<GetDiplomaByIdResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.id)) {
        return { success: false, data: { error: "Invalid diploma ID" } };
      }
      const result = await this.diplomaRepository.getDiplomaById(params);
      if (!result) {
        return { success: false, data: { error: "Diploma not found" } };
      }
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class CreateDiplomaUseCase implements ICreateDiplomaUseCase {
  constructor(private readonly diplomaRepository: IDiplomaRepository) { }

  async execute(params: CreateDiplomaRequestDTO): Promise<ResponseDTO<CreateDiplomaResponseDTO>> {
    try {
      const result = await this.diplomaRepository.createDiploma(params);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class UpdateDiplomaUseCase implements IUpdateDiplomaUseCase {
  constructor(private readonly diplomaRepository: IDiplomaRepository) { }

  async execute(params: UpdateDiplomaRequestDTO): Promise<ResponseDTO<UpdateDiplomaResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.id)) {
        return { success: false, data: { error: "Invalid diploma ID" } };
      }
      const result = await this.diplomaRepository.updateDiploma(params);
      if (!result) {
        return { success: false, data: { error: "Diploma not found" } };
      }
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class DeleteDiplomaUseCase implements IDeleteDiplomaUseCase {
  constructor(private readonly diplomaRepository: IDiplomaRepository) { }

  async execute(params: DeleteDiplomaRequestDTO): Promise<ResponseDTO<{ message: string }>> {
    try {
      if (!mongoose.isValidObjectId(params.id)) {
        return { success: false, data: { error: "Invalid diploma ID" } };
      }
      await this.diplomaRepository.deleteDiploma(params);
      return { success: true, data: { message: "Diploma deleted successfully" } };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
} 