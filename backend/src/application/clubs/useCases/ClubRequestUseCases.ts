import {
  GetClubRequestsRequestDTO,
  ApproveClubRequestRequestDTO,
  RejectClubRequestRequestDTO,
  GetClubRequestDetailsRequestDTO,
} from "../../../domain/clubs/dtos/ClubRequestRequestDTOs";
import {
  GetClubRequestsResponseDTO,
  GetClubRequestDetailsResponseDTO,
  SimplifiedClubRequestDTO,
} from "../../../domain/clubs/dtos/ClubRequestResponseDTOs";
import { IClubsRepository } from "../repositories/IClubsRepository";
import { GetClubRequestsRequest } from "../../../domain/clubs/entities/Club";
import mongoose from "mongoose";

// Use Case Interfaces
export interface IGetClubRequestsUseCase {
  execute(params: GetClubRequestsRequestDTO): Promise<GetClubRequestsResponseDTO>;
}

export interface IApproveClubRequestUseCase {
  execute(params: ApproveClubRequestRequestDTO): Promise<{ message: string }>;
}

export interface IRejectClubRequestUseCase {
  execute(params: RejectClubRequestRequestDTO): Promise<{ message: string }>;
}

export interface IGetClubRequestDetailsUseCase {
  execute(params: GetClubRequestDetailsRequestDTO): Promise<GetClubRequestDetailsResponseDTO>;
}


export class GetClubRequestsUseCase implements IGetClubRequestsUseCase {
  constructor(private clubsRepository: IClubsRepository) { }

  async execute(params: GetClubRequestsRequestDTO): Promise<GetClubRequestsResponseDTO> {
    if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
      throw new Error("Invalid page or limit parameters");
    }
    
    const repositoryRequest = new GetClubRequestsRequest(
      params.page,
      params.limit,
      params.status || "all",
      params.type || "all",
      params.startDate?.toISOString(),
      params.endDate?.toISOString(),
      params.search
    );
    
    const { rawRequests, totalItems, totalPages, currentPage } = await this.clubsRepository.getClubRequests(repositoryRequest);
    const mappedRequests: SimplifiedClubRequestDTO[] = rawRequests.map((req: any) => ({
      clubName: req.clubId?.name || "Unknown Club",
      requestedId: req._id.toString(),
      requestedBy: req.userId?.email || "Unknown User",
      type: req.clubId?.type || "Unknown Type",
      requestedAt: req.createdAt ? new Date(req.createdAt).toISOString() : "N/A",
      status: req.status || "pending",
    }));
    return {
      data: mappedRequests,
      totalItems,
      totalPages,
      currentPage,
    };
  }
}

export class ApproveClubRequestUseCase implements IApproveClubRequestUseCase {
  constructor(private clubsRepository: IClubsRepository) { }

  async execute(params: ApproveClubRequestRequestDTO): Promise<{ message: string }> {
    if (!mongoose.isValidObjectId(params.id)) {
      throw new Error("Invalid club request ID");
    }
    const clubRequest: any = await this.clubsRepository.getClubRequestDetails({ id: params.id });
    if (!clubRequest) {
      throw new Error("Club request not found");
    }
    if (clubRequest.status !== "pending") {
      throw new Error("Club request is not in pending status");
    }
    await this.clubsRepository.approveClubRequest(params);
    return { message: "Club request approved successfully" };
  }
} 

export class RejectClubRequestUseCase implements IRejectClubRequestUseCase {
  constructor(private clubsRepository: IClubsRepository) { }

  async execute(params: RejectClubRequestRequestDTO): Promise<{ message: string }> {
    if (!mongoose.isValidObjectId(params.id)) {
      throw new Error("Invalid club request ID");
    }
    const clubRequest: any = await this.clubsRepository.getClubRequestDetails({ id: params.id });
    if (!clubRequest) {
      throw new Error("Club request not found");
    }
    if (clubRequest.status !== "pending") {
      throw new Error("Club request is not in pending status");
    }
    await this.clubsRepository.rejectClubRequest(params);
    return { message: "Club request rejected successfully" };
  }
}

export class GetClubRequestDetailsUseCase implements IGetClubRequestDetailsUseCase {
  constructor(private clubsRepository: IClubsRepository) { }

  async execute(params: GetClubRequestDetailsRequestDTO): Promise<GetClubRequestDetailsResponseDTO> {
    if (!mongoose.isValidObjectId(params.id)) {
      throw new Error("Invalid club request ID");
    }
    const clubRequest: any = await this.clubsRepository.getClubRequestDetails(params);
    if (!clubRequest) {
      throw new Error("Club request not found");
    }
    if (!clubRequest.clubId) {
      throw new Error("Associated club not found");
    }
    return {
      clubRequest: {
        id: clubRequest._id.toString(),
        status: clubRequest.status,
        createdAt: clubRequest.createdAt.toISOString(),
        updatedAt: clubRequest.updatedAt.toISOString(),
        whyJoin: clubRequest.whyJoin,
        additionalInfo: clubRequest.additionalInfo || "",
        club: {
          id: clubRequest.clubId._id.toString(),
          name: clubRequest.clubId.name,
          type: clubRequest.clubId.type,
          about: clubRequest.clubId.about || "",
          nextMeeting: clubRequest.clubId.nextMeeting || "",
          enteredMembers: clubRequest.clubId.enteredMembers || 0,
        },
        user: clubRequest.userId
          ? {
              id: clubRequest.userId._id.toString(),
              name: `${clubRequest.userId.firstName} ${clubRequest.userId.lastName}`.trim(),
              email: clubRequest.userId.email,
            }
          : undefined,
      },
    };
  }
} 