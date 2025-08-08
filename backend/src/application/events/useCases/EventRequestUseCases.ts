import { GetEventRequestsRequestDTO, ApproveEventRequestRequestDTO, RejectEventRequestRequestDTO, GetEventRequestDetailsRequestDTO } from "../../../domain/events/dtos/EventRequestRequestDTOs";
import { GetEventRequestsResponseDTO, GetEventRequestDetailsResponseDTO } from "../../../domain/events/dtos/EventRequestResponseDTOs";
import { IEventsRepository } from "../repositories/IEventsRepository";
import mongoose from "mongoose";
import { InvalidEventRequestIdError, EventRequestNotFoundError, AssociatedEventNotFoundError, InvalidEventStatusError } from "../../../domain/events/errors/EventErrors";

export interface IGetEventRequestsUseCase {
  execute(params: GetEventRequestsRequestDTO): Promise<GetEventRequestsResponseDTO>;
}

export interface IApproveEventRequestUseCase {
  execute(params: ApproveEventRequestRequestDTO): Promise<{ message: string }>;
}

export interface IRejectEventRequestUseCase {
  execute(params: RejectEventRequestRequestDTO): Promise<{ message: string }>;
}

export interface IGetEventRequestDetailsUseCase {
  execute(params: GetEventRequestDetailsRequestDTO): Promise<GetEventRequestDetailsResponseDTO>;
}

export class GetEventRequestsUseCase implements IGetEventRequestsUseCase {
  constructor(private eventsRepository: IEventsRepository) { }

  async execute(params: GetEventRequestsRequestDTO): Promise<GetEventRequestsResponseDTO> {
    if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
      throw new Error("Invalid page or limit parameters");
    }
    if (params.startDate && isNaN(params.startDate.getTime())) {
      throw new Error("Invalid startDate format");
    }
    if (params.endDate && isNaN(params.endDate.getTime())) {
      throw new Error("Invalid endDate format");
    }

    const result: any = await this.eventsRepository.getEventRequests(
      params.page,
      params.limit,
      params.status,
      params.startDate ? params.startDate.toISOString() : "",
      params.endDate ? params.endDate.toISOString() : "",
      params.type,
      params.search,
      params.organizerType,
      params.dateRange
    );

    const filteredRequests = result.rawRequests.filter((req) => req.eventId);
    const mappedRequests = filteredRequests.map((req) => ({
      eventName: req.eventId?.title || "Unknown Event",
      requestedId: req._id.toString(),
      requestedBy: req.userId?.email || "Unknown User",
      type: req.eventId?.eventType || "Unknown Type",
      requestedDate: req.createdAt ? new Date(req.createdAt).toISOString() : "N/A",
      status: req.status || "pending",
      proposedDate: req.eventId?.date ? new Date(req.eventId.date).toISOString() : "N/A",
    }));

    return {
      data: mappedRequests,
      totalItems: filteredRequests.length,
      totalPages: Math.ceil(filteredRequests.length / params.limit),
      currentPage: result.currentPage,
    };
  }
}

export class ApproveEventRequestUseCase implements IApproveEventRequestUseCase {
  constructor(private eventsRepository: IEventsRepository) { }

  async execute(params: ApproveEventRequestRequestDTO): Promise<{ message: string }> {
    if (!mongoose.isValidObjectId(params.id)) {
      throw new InvalidEventRequestIdError(params.id);
    }
    const eventRequestDetails: any = await this.eventsRepository.getEventRequestDetails(params.id);
    if (!eventRequestDetails) {
      throw new EventRequestNotFoundError(params.id);
    }
    if (eventRequestDetails.status !== "pending") {
      throw new InvalidEventStatusError(eventRequestDetails.status);
    }
    await this.eventsRepository.approveEventRequest(params.id);
    return { message: "Event request approved successfully" };
  }
}

export class RejectEventRequestUseCase implements IRejectEventRequestUseCase {
  constructor(private eventsRepository: IEventsRepository) { }

  async execute(params: RejectEventRequestRequestDTO): Promise<{ message: string }> {
    if (!mongoose.isValidObjectId(params.id)) {
      throw new InvalidEventRequestIdError(params.id);
    }
    const eventRequestDetails: any = await this.eventsRepository.getEventRequestDetails(params.id);
    if (!eventRequestDetails) {
      throw new EventRequestNotFoundError(params.id);
    }
    if (eventRequestDetails.status !== "pending") {
      throw new InvalidEventStatusError(eventRequestDetails.status);
    }
    await this.eventsRepository.rejectEventRequest(params.id);
    return { message: "Event request rejected successfully" };
  }
}

export class GetEventRequestDetailsUseCase implements IGetEventRequestDetailsUseCase {
  constructor(private eventsRepository: IEventsRepository) { }

  async execute(params: GetEventRequestDetailsRequestDTO): Promise<GetEventRequestDetailsResponseDTO> {
    if (!mongoose.isValidObjectId(params.id)) {
      throw new InvalidEventRequestIdError(params.id);
    }
    const eventRequest: any = await this.eventsRepository.getEventRequestDetails(params.id);
    if (!eventRequest) {
      throw new EventRequestNotFoundError(params.id);
    }
    if (!eventRequest.eventId) {
      throw new AssociatedEventNotFoundError();
    }
    return {
      eventRequest: {
        id: eventRequest._id.toString(),
        status: eventRequest.status,
        createdAt: eventRequest.createdAt.toISOString(),
        updatedAt: eventRequest.updatedAt.toISOString(),
        whyJoin: eventRequest.whyJoin,
        additionalInfo: eventRequest.additionalInfo || "",
        event: {
          id: eventRequest.eventId._id.toString(),
          title: eventRequest.eventId.title,
          description: eventRequest.eventId.description,
          date: eventRequest.eventId.date,
          location: eventRequest.eventId.location,
          participantsCount: eventRequest.eventId.participantsCount,
        },
        user: eventRequest.userId
          ? {
            id: eventRequest.userId._id.toString(),
            name: `${eventRequest.userId.firstName} ${eventRequest.userId.lastName}`.trim(),
            email: eventRequest.userId.email,
          }
          : undefined,
      },
    };
  }
}