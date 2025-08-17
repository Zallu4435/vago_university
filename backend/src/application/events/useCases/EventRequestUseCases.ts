import { GetEventRequestsRequestDTO, ApproveEventRequestRequestDTO, RejectEventRequestRequestDTO, GetEventRequestDetailsRequestDTO } from "../../../domain/events/dtos/EventRequestRequestDTOs";
import { GetEventRequestsResponseDTO, GetEventRequestDetailsResponseDTO } from "../../../domain/events/dtos/EventRequestResponseDTOs";
import { IEventsRepository } from "../repositories/IEventsRepository";
import mongoose from "mongoose";
import { InvalidEventRequestIdError, EventRequestNotFoundError, AssociatedEventNotFoundError, InvalidEventStatusError } from "../../../domain/events/errors/EventErrors";
import { PaginatedResponse, SimplifiedEventRequest, EventRequestDetails, EventRequestDocument } from "../../../domain/events/entities/Event";

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

    const result = await this.eventsRepository.getEventRequests(
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
    
    // Use EventRequestDocument for filter and map
    const filteredRequests = result.events.filter((req) => {
      // eventId can be string or EventDocument
      if (typeof req.eventId === 'object' && req.eventId !== null && 'title' in req.eventId) {
        return true;
      }
      return false;
    });
    const mappedRequests = filteredRequests.map((req) => {
      let eventName = "Unknown Event";
      let type = "Unknown Type";
      let proposedDate = "N/A";
      if (typeof req.eventId === 'object' && req.eventId !== null) {
        eventName = req.eventId.title || eventName;
        type = (req.eventId as { eventType?: string }).eventType || type;
        if ('date' in req.eventId && req.eventId.date) {
          proposedDate = new Date(req.eventId.date).toISOString();
        }
      }
      let requestedBy = "Unknown User";
      if (typeof req.userId === 'object' && req.userId !== null && 'email' in req.userId) {
        requestedBy = req.userId.email;
      }
      return {
        eventName,
        requestedId: req._id.toString(),
        requestedBy,
        type,
        requestedDate: req.createdAt ? new Date(req.createdAt).toISOString() : "N/A",
        status: req.status || "pending",
        proposedDate,
      };
    });

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
    const eventRequestDetails: EventRequestDocument | null = await this.eventsRepository.getEventRequestDetails(params.id);
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
    const eventRequestDetails: EventRequestDocument | null = await this.eventsRepository.getEventRequestDetails(params.id);
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
    const eventRequest: EventRequestDocument | null = await this.eventsRepository.getEventRequestDetails(params.id);
    if (!eventRequest) {
      throw new EventRequestNotFoundError(params.id);
    }
    if (!eventRequest.eventId || typeof eventRequest.eventId === 'string') {
      throw new AssociatedEventNotFoundError();
    }
    if (!eventRequest.userId || typeof eventRequest.userId === 'string') {
      throw new AssociatedEventNotFoundError();
    }
    return {
      eventRequest: {
        id: eventRequest._id,
        status: eventRequest.status,
        createdAt: eventRequest.createdAt.toISOString(),
        updatedAt: eventRequest.updatedAt.toISOString(),
        whyJoin: eventRequest.whyJoin,
        additionalInfo: eventRequest.additionalInfo || "",
        event: {
          id: eventRequest.eventId._id,
          title: eventRequest.eventId.title,
          description: eventRequest.eventId.description,
          date: eventRequest.eventId.date,
          location: eventRequest.eventId.location,
          participantsCount: eventRequest.eventId.participants,
        },
        user: {
          id: eventRequest.userId._id,
          name: `${eventRequest.userId.firstName} ${eventRequest.userId.lastName}`,
          email: eventRequest.userId.email,
        },
      },
    };
  }
}