import { IClubsRepository } from "../repositories/IClubsRepository";
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

// Local ResponseDTO type if missing
export interface ResponseDTO<T> {
  success: boolean;
  data: T | { error: string };
}

export interface IGetClubRequestsUseCase {
  execute(dto: GetClubRequestsRequestDTO): Promise<ResponseDTO<GetClubRequestsResponseDTO>>;
}

export interface IApproveClubRequestUseCase {
  execute(dto: ApproveClubRequestRequestDTO): Promise<ResponseDTO<{ message: string }>>;
}

export interface IRejectClubRequestUseCase {
  execute(dto: RejectClubRequestRequestDTO): Promise<ResponseDTO<{ message: string }>>;
}

export interface IGetClubRequestDetailsUseCase {
  execute(dto: GetClubRequestDetailsRequestDTO): Promise<ResponseDTO<GetClubRequestDetailsResponseDTO>>;
}

export class GetClubRequestsUseCase implements IGetClubRequestsUseCase {
  constructor(private clubsRepository: IClubsRepository) {}

  async execute(dto: GetClubRequestsRequestDTO): Promise<ResponseDTO<GetClubRequestsResponseDTO>> {
    try {
      const data = await this.clubsRepository.getClubRequests(dto);
      return { success: true, data };
    } catch (error: any) {
      return { success: false, data: { error: error.message || "Failed to get club requests" } };
    }
  }
}

export class ApproveClubRequestUseCase implements IApproveClubRequestUseCase {
  constructor(private clubsRepository: IClubsRepository) {}

  async execute(dto: ApproveClubRequestRequestDTO): Promise<ResponseDTO<{ message: string }>> {
    try {
      await this.clubsRepository.approveClubRequest(dto);
      return { success: true, data: { message: "Club request approved successfully" } };
    } catch (error: any) {
      return { success: false, data: { error: error.message || "Failed to approve club request" } };
    }
  }
}

export class RejectClubRequestUseCase implements IRejectClubRequestUseCase {
  constructor(private clubsRepository: IClubsRepository) {}

  async execute(dto: RejectClubRequestRequestDTO): Promise<ResponseDTO<{ message: string }>> {
    try {
      await this.clubsRepository.rejectClubRequest(dto);
      return { success: true, data: { message: "Club request rejected successfully" } };
    } catch (error: any) {
      return { success: false, data: { error: error.message || "Failed to reject club request" } };
    }
  }
}

export class GetClubRequestDetailsUseCase implements IGetClubRequestDetailsUseCase {
  constructor(private clubsRepository: IClubsRepository) {}

  async execute(dto: GetClubRequestDetailsRequestDTO): Promise<ResponseDTO<GetClubRequestDetailsResponseDTO>> {
    try {
      const data = await this.clubsRepository.getClubRequestDetails(dto);
      if (!data) {
        return { success: false, data: { error: "Club request not found!" } };
      }
      return { success: true, data };
    } catch (error: any) {
      return { success: false, data: { error: error.message || "Failed to get club request details" } };
    }
  }
} 