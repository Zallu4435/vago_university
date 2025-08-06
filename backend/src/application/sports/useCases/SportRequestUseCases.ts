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

export class GetSportRequestsUseCase {
  constructor(private sportsRepository: ISportsRepository) { }

  async execute(params: GetSportRequestsRequestDTO): Promise<GetSportRequestsResponseDTO> {
    if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
      throw new Error("Invalid page or limit parameters");
    }
    const { requests, totalItems, totalPages, currentPage } = await this.sportsRepository.getSportRequests(params);
    const mappedRequests = requests.map((request: any) => ({
      sportName: request.sportId?.title || "Unknown Sport",
      requestId: request._id?.toString() || request.requestId,
      requestedBy: request.userId?.email || "Unknown User",
      type: request.sportId?.type || "Unknown Type",
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
    const sportRequest: any = await this.sportsRepository.getSportRequestDetails({ id: params.id });
    if (!sportRequest) {
      throw new Error("Sport request not found");
    }
    if (sportRequest.status !== "pending") {
      throw new Error("Sport request is not in pending status");
    }
    await this.sportsRepository.approveSportRequest(params);
    return { message: "Sport request approved successfully" };
  }
}

export class RejectSportRequestUseCase {
  constructor(private sportsRepository: ISportsRepository) { }

  async execute(params: RejectSportRequestRequestDTO): Promise<{ message: string }> {
    if (!mongoose.isValidObjectId(params.id)) {
      throw new Error("Invalid sport request ID");
    }
    const sportRequest: any = await this.sportsRepository.getSportRequestDetails({ id: params.id });
    if (!sportRequest) {
      throw new Error("Sport request not found");
    }
    if (sportRequest.status !== "pending") {
      throw new Error("Sport request is not in pending status");
    }
    await this.sportsRepository.rejectSportRequest(params);
    return { message: "Sport request rejected successfully" };
  }
}

export class GetSportRequestDetailsUseCase {
  constructor(private sportsRepository: ISportsRepository) { }

  async execute(params: GetSportRequestDetailsRequestDTO): Promise<GetSportRequestDetailsResponseDTO> {
    if (!mongoose.isValidObjectId(params.id)) {
      throw new Error("Invalid sport request ID");
    }
    const sportRequest: any = await this.sportsRepository.getSportRequestDetails(params);
    if (!sportRequest) {
      throw new Error("Sport request not found");
    }
    if (!sportRequest.sportId) {
      throw new Error("Associated sport not found");
    }
    return {
      sportRequest: {
        id: sportRequest._id?.toString() || sportRequest.id,
        status: sportRequest.status,
        createdAt: sportRequest.createdAt ? new Date(sportRequest.createdAt).toISOString() : undefined,
        updatedAt: sportRequest.updatedAt ? new Date(sportRequest.updatedAt).toISOString() : undefined,
        whyJoin: sportRequest.whyJoin,
        additionalInfo: sportRequest.additionalInfo || "",
        sport: {
          id: sportRequest.sportId._id?.toString() || sportRequest.sportId.id,
          title: sportRequest.sportId.title,
          type: sportRequest.sportId.type,
          headCoach: sportRequest.sportId.headCoach || "Unknown",
          playerCount: sportRequest.sportId.participants || 0,
          division: sportRequest.sportId.division || "N/A",
        },
        user: sportRequest.userId
          ? {
              id: sportRequest.userId._id?.toString() || sportRequest.userId.id,
              name: `${sportRequest.userId.firstName} ${sportRequest.userId.lastName}`.trim(),
              email: sportRequest.userId.email,
            }
          : undefined,
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
    const joinResult: any = await this.sportsRepository.joinSport(params);
    return {
      requestId: joinResult._id?.toString() || joinResult.requestId,
      status: joinResult.status,
      message: joinResult.message,
    };
  }
} 