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


export interface IGetSportRequestsUseCase {
  execute(params: GetSportRequestsRequestDTO): Promise<GetSportRequestsResponseDTO>;
}

export interface IApproveSportRequestUseCase {
  execute(params: ApproveSportRequestRequestDTO): Promise<{ message: string }>;
}

export interface IRejectSportRequestUseCase {
  execute(params: RejectSportRequestRequestDTO): Promise<{ message: string }>;
}

export interface IGetSportRequestDetailsUseCase {
  execute(params: GetSportRequestDetailsRequestDTO): Promise<GetSportRequestDetailsResponseDTO>;
}

export interface IJoinSportUseCase {
  execute(params: JoinSportRequestDTO): Promise<JoinSportResponseDTO>;
}

export class GetSportRequestsUseCase {
  constructor(private sportsRepository: ISportsRepository) { }

  async execute(params: GetSportRequestsRequestDTO): Promise<GetSportRequestsResponseDTO> {
    if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
      throw new Error("Invalid page or limit parameters");
    }
    const { requests, totalItems, totalPages, currentPage } = await this.sportsRepository.getSportRequests(params.page, params.limit, params.status, params.type, params.startDate, params.endDate, params.search);
    const mappedRequests = requests.map((request) => ({
      sportName: typeof request.sportId === 'object' && request.sportId?.title ? request.sportId.title : "Unknown Sport",
      requestId: request._id?.toString() || "",
      requestedBy: typeof request.userId === 'object' && request.userId?.email ? request.userId.email : "Unknown User",
      type: typeof request.sportId === 'object' && request.sportId?.type ? request.sportId.type : "Unknown Type",
      requestedAt: request.createdAt ? new Date(request.createdAt).toISOString() : "",
      status: request.status || "pending",
    }));
    return {
      requests: mappedRequests,
      data: mappedRequests,
      totalItems,
      totalPages,
      currentPage,
    };
  }
}

export class ApproveSportRequestUseCase {
  constructor(private sportsRepository: ISportsRepository) { }

  async execute(params: ApproveSportRequestRequestDTO): Promise<{ message: string }> {
    if (!mongoose.isValidObjectId(params.id)) {
      throw new Error("Invalid sport request ID");
    }
    const sportRequest = await this.sportsRepository.getSportRequestDetails(params.id);
    if (!sportRequest) {
      throw new Error("Sport request not found");
    }
    if (sportRequest.status !== "pending") {
      throw new Error("Sport request is not in pending status");
    }
    await this.sportsRepository.approveSportRequest(params.id);
    return { message: "Sport request approved successfully" };
  }
}

export class RejectSportRequestUseCase {
  constructor(private sportsRepository: ISportsRepository) { }

  async execute(params: RejectSportRequestRequestDTO): Promise<{ message: string }> {
    if (!mongoose.isValidObjectId(params.id)) {
      throw new Error("Invalid sport request ID");
    }
    const sportRequest = await this.sportsRepository.getSportRequestDetails(params.id);
    if (!sportRequest) {
      throw new Error("Sport request not found");
    }
    if (sportRequest.status !== "pending") {
      throw new Error("Sport request is not in pending status");
    }
    await this.sportsRepository.rejectSportRequest(params.id);
    return { message: "Sport request rejected successfully" };
  }
}

export class GetSportRequestDetailsUseCase {
  constructor(private sportsRepository: ISportsRepository) { }

  async execute(params: GetSportRequestDetailsRequestDTO): Promise<GetSportRequestDetailsResponseDTO> {
    if (!mongoose.isValidObjectId(params.id)) {
      throw new Error("Invalid sport request ID");
    }
    const sportRequest = await this.sportsRepository.getSportRequestDetails(params.id);
    if (!sportRequest) {
      throw new Error("Sport request not found");
    }
    if (!sportRequest.sportId || typeof sportRequest.sportId === 'string') {
      throw new Error("Associated sport not found");
    }
    if (!sportRequest.userId || typeof sportRequest.userId === 'string') {
      throw new Error("Associated user not found");
    }
    return {
      sportRequest: {
        id: sportRequest._id?.toString() || "",
        status: sportRequest.status,
        createdAt: sportRequest.createdAt ? new Date(sportRequest.createdAt).toISOString() : undefined,
        updatedAt: sportRequest.updatedAt ? new Date(sportRequest.updatedAt).toISOString() : undefined,
        whyJoin: sportRequest.whyJoin,
        additionalInfo: sportRequest.additionalInfo || "",
        sport: {
          id: sportRequest.sportId._id?.toString() || "",
          title: sportRequest.sportId.title,
          type: sportRequest.sportId.type,
          headCoach: sportRequest.sportId.headCoach || "Unknown",
          playerCount: sportRequest.sportId.participants || 0,
          division: sportRequest.sportId.division || "N/A",
        },
        user: {
          id: sportRequest.userId._id?.toString() || "",
          name: `${sportRequest.userId.firstName} ${sportRequest.userId.lastName}`.trim(),
          email: sportRequest.userId.email,
        },
      },
    };
  }
}

export class JoinSportUseCase {
  constructor(private sportsRepository: ISportsRepository) { }

  async execute(params: JoinSportRequestDTO): Promise<JoinSportResponseDTO> {
    if (!mongoose.isValidObjectId(params.sportId)) {
      throw new Error("Invalid sport ID");
    }
    const joinResult = await this.sportsRepository.joinSport(params.sportId);
    return {
      requestId: joinResult._id?.toString() || "",
      status: joinResult.status,
      message: "Sport join request created successfully",
    };
  }
} 