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
import {
  IGetSportRequestsUseCase,
  IApproveSportRequestUseCase,
  IRejectSportRequestUseCase,
  IGetSportRequestDetailsUseCase,
  IJoinSportUseCase
} from './ISportRequestUseCases';


export class GetSportRequestsUseCase implements IGetSportRequestsUseCase {
  constructor(private _sportsRepository: ISportsRepository) { }

  async execute(params: GetSportRequestsRequestDTO): Promise<GetSportRequestsResponseDTO> {
    if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
      throw new Error("Invalid page or limit parameters");
    }
    const { requests, totalItems, totalPages, currentPage } = await this._sportsRepository.getSportRequests(params.page, params.limit, params.status, params.type, params.startDate, params.endDate, params.search);
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

export class ApproveSportRequestUseCase implements IApproveSportRequestUseCase {
  constructor(private _sportsRepository: ISportsRepository) { }

  async execute(params: ApproveSportRequestRequestDTO): Promise<{ message: string }> {
    if (!params.id) {
      throw new Error("Sport request ID is required");
    }
    const sportRequest = await this._sportsRepository.getSportRequestDetails(params.id);
    if (!sportRequest) {
      throw new Error("Sport request not found");
    }
    if (sportRequest.status !== "pending") {
      throw new Error("Sport request is not in pending status");
    }
    await this._sportsRepository.approveSportRequest(params.id);
    return { message: "Sport request approved successfully" };
  }
}

export class RejectSportRequestUseCase implements IRejectSportRequestUseCase {
  constructor(private _sportsRepository: ISportsRepository) { }

  async execute(params: RejectSportRequestRequestDTO): Promise<{ message: string }> {
    if (!params.id) {
      throw new Error("Sport request ID is required");
    }
    const sportRequest = await this._sportsRepository.getSportRequestDetails(params.id);
    if (!sportRequest) {
      throw new Error("Sport request not found");
    }
    if (sportRequest.status !== "pending") {
      throw new Error("Sport request is not in pending status");
    }
    await this._sportsRepository.rejectSportRequest(params.id);
    return { message: "Sport request rejected successfully" };
  }
}

export class GetSportRequestDetailsUseCase implements IGetSportRequestDetailsUseCase {
  constructor(private _sportsRepository: ISportsRepository) { }

  async execute(params: GetSportRequestDetailsRequestDTO): Promise<GetSportRequestDetailsResponseDTO> {
    if (!params.id) {
      throw new Error("Sport request ID is required");
    }
    const sportRequest = await this._sportsRepository.getSportRequestDetails(params.id);
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

export class JoinSportUseCase implements IJoinSportUseCase {
  constructor(private _sportsRepository: ISportsRepository) { }

  async execute(params: JoinSportRequestDTO): Promise<JoinSportResponseDTO> {
    if (!params.sportId) {
      throw new Error("Sport ID is required");
    }
    const joinResult = await this._sportsRepository.joinSport(params.sportId);
    return {
      requestId: joinResult._id?.toString() || "",
      status: joinResult.status,
      message: "Sport join request created successfully",
    };
  }
} 