import {
    GetClubsRequestDTO,
    GetClubByIdRequestDTO,
    CreateClubRequestDTO,
    UpdateClubRequestDTO,
    DeleteClubRequestDTO,
  } from "../../../domain/clubs/dtos/ClubRequestDTOs";
  import {
    GetClubsResponseDTO,
    GetClubByIdResponseDTO,
    CreateClubResponseDTO,
    UpdateClubResponseDTO,
  } from "../../../domain/clubs/dtos/ClubResponseDTOs";
  import {
    GetClubRequestsRequestDTO,
    ApproveClubRequestRequestDTO,
    RejectClubRequestRequestDTO,
    GetClubRequestDetailsRequestDTO,
  } from "../../../domain/clubs/dtos/ClubRequestRequestDTOs";
  import {
    GetClubRequestsResponseDTO,
    GetClubRequestDetailsResponseDTO,
  } from "../../../domain/clubs/dtos/ClubRequestResponseDTOs";
  import { IClubsRepository } from "../repositories/IClubsRepository";
  import mongoose from "mongoose";

  // Local ResponseDTO type if missing
  export interface ResponseDTO<T> {
    success: boolean;
    data: T | { error: string };
  }

  export interface IGetClubsUseCase {
    execute(dto: GetClubsRequestDTO): Promise<ResponseDTO<GetClubsResponseDTO>>;
  }
  
  export interface IGetClubByIdUseCase {
    execute(dto: GetClubByIdRequestDTO): Promise<ResponseDTO<GetClubByIdResponseDTO>>;
  }
  
  export interface ICreateClubUseCase {
    execute(dto: CreateClubRequestDTO): Promise<ResponseDTO<CreateClubResponseDTO>>;
  }
  
  export interface IUpdateClubUseCase {
    execute(dto: UpdateClubRequestDTO): Promise<ResponseDTO<UpdateClubResponseDTO>>;
  }
  
  export interface IDeleteClubUseCase {
    execute(dto: DeleteClubRequestDTO): Promise<ResponseDTO<{ message: string }>>;
  }
  
  export interface IGetClubRequestsUseCase {
    execute(params: GetClubRequestsRequestDTO): Promise<{ success: boolean; data: GetClubRequestsResponseDTO }>;
  }
  
  export interface IApproveClubRequestUseCase {
    execute(params: ApproveClubRequestRequestDTO): Promise<{ success: boolean; data: void }>;
  }
  
  export interface IRejectClubRequestUseCase {
    execute(params: RejectClubRequestRequestDTO): Promise<{ success: boolean; data: void }>;
  }
  
  export interface IGetClubRequestDetailsUseCase {
    execute(params: GetClubRequestDetailsRequestDTO): Promise<{ success: boolean; data: GetClubRequestDetailsResponseDTO | null }>;
  }

  export class GetClubsUseCase implements IGetClubsUseCase {
    constructor(private clubsRepository: IClubsRepository) {}

    async execute(dto: GetClubsRequestDTO): Promise<ResponseDTO<GetClubsResponseDTO>> {
      try {
        if (isNaN(dto.page) || dto.page < 1 || isNaN(dto.limit) || dto.limit < 1) {
          return { success: false, data: { error: "Invalid page or limit parameters" } };
        }
        if (dto.startDate && isNaN(dto.startDate.getTime())) {
          return { success: false, data: { error: "Invalid startDate format" } };
        }
        if (dto.endDate && isNaN(dto.endDate.getTime())) {
          return { success: false, data: { error: "Invalid endDate format" } };
        }
        const data = await this.clubsRepository.getClubs(dto);
        return { success: true, data };
      } catch (error: any) {
        return { success: false, data: { error: error.message } };
      }
    }
  }

  export class GetClubByIdUseCase implements IGetClubByIdUseCase {
    constructor(private clubsRepository: IClubsRepository) {}

    async execute(dto: GetClubByIdRequestDTO): Promise<ResponseDTO<GetClubByIdResponseDTO>> {
      try {
        if (!mongoose.isValidObjectId(dto.id)) {
          return { success: false, data: { error: "Invalid club ID" } };
        }
        const data = await this.clubsRepository.getClubById(dto);
        if (!data) {
          return { success: false, data: { error: "Club not found!" } };
        }
        return { success: true, data };
      } catch (error: any) {
        return { success: false, data: { error: error.message } };
      }
    }
  }

  export class CreateClubUseCase implements ICreateClubUseCase {
    constructor(private clubsRepository: IClubsRepository) {}

    async execute(dto: CreateClubRequestDTO): Promise<ResponseDTO<CreateClubResponseDTO>> {
      try {
        const data = await this.clubsRepository.createClub(dto);
        return { success: true, data };
      } catch (error: any) {
        return { success: false, data: { error: error.message } };
      }
    }
  }

  export class UpdateClubUseCase implements IUpdateClubUseCase {
    constructor(private clubsRepository: IClubsRepository) {}

    async execute(dto: UpdateClubRequestDTO): Promise<ResponseDTO<UpdateClubResponseDTO>> {
      try {
        if (!mongoose.isValidObjectId(dto.id)) {
          return { success: false, data: { error: "Invalid club ID" } };
        }
        const data = await this.clubsRepository.updateClub(dto);
        if (!data) {
          return { success: false, data: { error: "Club not found!" } };
        }
        return { success: true, data };
      } catch (error: any) {
        return { success: false, data: { error: error.message } };
      }
    }
  }

  export class DeleteClubUseCase implements IDeleteClubUseCase {
    constructor(private clubsRepository: IClubsRepository) {}

    async execute(dto: DeleteClubRequestDTO): Promise<ResponseDTO<{ message: string }>> {
      try {
        if (!mongoose.isValidObjectId(dto.id)) {
          return { success: false, data: { error: "Invalid club ID" } };
        }
        await this.clubsRepository.deleteClub(dto);
        return { success: true, data: { message: "Club deleted successfully" } };
      } catch (error: any) {
        return { success: false, data: { error: error.message } };
      }
    }
  }