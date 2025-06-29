import mongoose from "mongoose";
import {
  GetEventByIdRequestDTO,
  CreateEventRequestDTO,
  UpdateEventRequestDTO,
  DeleteEventRequestDTO,
  GetEventsRequestDTO,
} from "../../../domain/events/dtos/EventRequestDTOs";
import {
  GetEventsResponseDTO,
  GetEventByIdResponseDTO,
  CreateEventResponseDTO,
  UpdateEventResponseDTO,
  EventSummaryDTO,
} from "../../../domain/events/dtos/EventResponseDTOs";
import {
  GetEventRequestsRequestDTO,
  RejectEventRequestRequestDTO,
  GetEventRequestDetailsRequestDTO,
  ApproveEventRequestRequestDTO,
} from "../../../domain/events/dtos/EventRequestRequestDTOs";
import {
  GetEventRequestsResponseDTO,
  GetEventRequestDetailsResponseDTO,
  SimplifiedEventRequestDTO,
} from "../../../domain/events/dtos/EventRequestResponseDTOs";
import { IEventsRepository } from "../../../application/events/repositories/IEventsRepository";
import {
  CampusEventModel,
  EventRequestModel,
} from "../../../infrastructure/database/mongoose/models/events/CampusEventModel";
import { Event } from "../../../domain/events/entities/Event";
import {
  EventRequest,
  EventRequestStatus,
} from "../../../domain/events/entities/EventRequest";

export class EventsRepository implements IEventsRepository {
  async getEvents(params: GetEventsRequestDTO): Promise<GetEventsResponseDTO> {
    const { page, limit, type, status, startDate, endDate } = params;
    const query: any = {};

    if (type !== "all") {
      query.eventType = type;
    }
    if (status !== "all") {
      query.status = status;
    }
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = startDate.toISOString().split('T')[0];
      }
      if (endDate) {
        query.date.$lte = endDate.toISOString().split('T')[0];
      }
    }

    const skip = (page - 1) * limit;
    const events = await (CampusEventModel as any).find(query)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalItems = await (CampusEventModel as any).countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const mappedEvents: EventSummaryDTO[] = events.map((event: any) => ({
      id: event._id.toString(),
      title: event.title,
      organizerType: event.organizerType,
      eventType: event.eventType,
      location: event.location,
      timeframe: event.timeframe,
      status: event.status,
      date: event.date
    }));

    return {
      data: mappedEvents,
      totalItems,
      totalPages,
      currentPage: page,
    };
  }

  async getEventById(
    params: GetEventByIdRequestDTO
  ): Promise<GetEventByIdResponseDTO | null> {
    const event = await (CampusEventModel as any).findById(params.id).lean();
    if (!event) {
      return null;
    }

    return {
      event: new Event({
        id: (event as any)._id.toString(),
        title: (event as any).title,
        organizer: (event as any).organizer,
        organizerType: (event as any).organizerType,
        eventType: (event as any).eventType,
        date: (event as any).date,
        time: (event as any).time,
        location: (event as any).location,
        timeframe: (event as any).timeframe,
        status: (event as any).status,
        icon: (event as any).icon,
        color: (event as any).color,
        description: (event as any).description,
        fullTime: (event as any).fullTime,
        additionalInfo: (event as any).description,
        requirements: (event as any).requirements,
        maxParticipants: (event as any).maxParticipants,
        registrationRequired: (event as any).registrationRequired,
        participants: (event as any).participants,
      }),
    };
  }

  async createEvent(
    params: CreateEventRequestDTO
  ): Promise<CreateEventResponseDTO> {
    const newEvent = await (CampusEventModel as any).create(params);
    return {
      event: new Event({
        id: newEvent._id.toString(),
        title: newEvent.title,
        organizer: newEvent.organizer,
        organizerType: newEvent.organizerType,
        eventType: newEvent.eventType,
        date: newEvent.date,
        time: newEvent.time,
        location: newEvent.location,
        timeframe: newEvent.timeframe,
        status: newEvent.status,
        icon: newEvent.icon,
        color: newEvent.color,
        description: newEvent.description,
        fullTime: newEvent.fullTime,
        additionalInfo: newEvent.additionalInfo,
        requirements: newEvent.requirements,
        maxParticipants: newEvent.maxParticipants,
        registrationRequired: newEvent.registrationRequired,
        participants: newEvent.participants,
      }),
    };
  }

  async updateEvent(
    params: UpdateEventRequestDTO
  ): Promise<UpdateEventResponseDTO | null> {
    const updatedEvent = await (CampusEventModel as any).findByIdAndUpdate(
      params.id,
      { $set: params },
      { new: true }
    ).lean();

    if (!updatedEvent) {
      return null;
    }

    return {
      event: new Event({
        id: (updatedEvent as any)._id.toString(),
        title: (updatedEvent as any).title,
        organizer: (updatedEvent as any).organizer,
        organizerType: (updatedEvent as any).organizerType,
        eventType: (updatedEvent as any).eventType,
        date: (updatedEvent as any).date,
        time: (updatedEvent as any).time,
        location: (updatedEvent as any).location,
        timeframe: (updatedEvent as any).timeframe,
        status: (updatedEvent as any).status,
        icon: (updatedEvent as any).icon,
        color: (updatedEvent as any).color,
        description: (updatedEvent as any).description,
        fullTime: (updatedEvent as any).fullTime,
        additionalInfo: (updatedEvent as any).additionalInfo,
        requirements: (updatedEvent as any).requirements,
        maxParticipants: (updatedEvent as any).maxParticipants,
        registrationRequired: (updatedEvent as any).registrationRequired,
        participants: (updatedEvent as any).participants,
      }),
    };
  }

  async deleteEvent(params: DeleteEventRequestDTO): Promise<void> {
    await (CampusEventModel as any).findByIdAndDelete(params.id);
  }

  async getEventRequests(
    params: GetEventRequestsRequestDTO
  ): Promise<GetEventRequestsResponseDTO> {
    const { page, limit, status, startDate, endDate, type } = params;
    const query: any = {};

    if (status !== "all") {
      query.status = status;
    }

    const eventQuery: any = {};
    if (type && type.toLowerCase() !== "all") {
      eventQuery.eventType = type;
    }

    // Handle date filtering
    if (startDate || endDate) {
      eventQuery.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        eventQuery.date.$gte = start.toISOString().split('T')[0];
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        eventQuery.date.$lte = end.toISOString().split('T')[0];
      }
    }

    const matchingEvents = await (CampusEventModel as any).find(eventQuery)
      .select("_id")
      .lean();

    const eventIds = matchingEvents.map((event: any) => event._id);

    if (eventIds.length > 0) {
      query.eventId = { $in: eventIds };
    }

    const totalItems = await (EventRequestModel as any).countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (page - 1) * limit;

    const rawRequests = await (EventRequestModel as any).find(query)
      .populate({
        path: "eventId",
        select: "title eventType date",
        match: eventQuery
      })
      .populate("userId", "email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const filteredRequests = rawRequests.filter(req => req.eventId);

    const mappedRequests: SimplifiedEventRequestDTO[] = filteredRequests.map((req: any) => ({
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
      totalPages: Math.ceil(filteredRequests.length / limit),
      currentPage: page,
    };
  }

  async approveEventRequest(
    params: ApproveEventRequestRequestDTO
  ): Promise<void> {
    const eventRequest = await (EventRequestModel as any).findById(params.id);
    if (!eventRequest) {
      throw new Error("Event request not found");
    }

    if (eventRequest.status !== EventRequestStatus.Pending.toString()) {
      throw new Error("Event request is not in pending status");
    }

    await (EventRequestModel as any).findByIdAndUpdate(
      params.id,
      { status: EventRequestStatus.Approved, updatedAt: new Date() },
      { runValidators: true }
    );

    const updatedEvent = await (CampusEventModel as any).findByIdAndUpdate(
      eventRequest.eventId,
      { $inc: { participantsCount: 1 } },
      { new: true }
    );

    if (!updatedEvent) {
      console.warn(`No event found for ID: ${eventRequest.eventId}`);
    } else {
      console.log(`Participants count incremented for event ID: ${eventRequest.eventId}`);
    }
  }

  async rejectEventRequest(
    params: RejectEventRequestRequestDTO
  ): Promise<void> {
    const eventRequest = await (EventRequestModel as any).findById(params.id);
    if (!eventRequest) {
      throw new Error("Event request not found");
    }

    if (eventRequest.status !== EventRequestStatus.Pending.toString()) {
      throw new Error("Event request is not in pending status");
    }

    await (EventRequestModel as any).findByIdAndUpdate(
      params.id,
      { status: EventRequestStatus.Rejected, updatedAt: new Date() },
      { runValidators: true }
    );
  }

  async getEventRequestDetails(
    params: GetEventRequestDetailsRequestDTO
  ): Promise<GetEventRequestDetailsResponseDTO | null> {
    if (!mongoose.isValidObjectId(params.id)) {
      throw new Error("Invalid event request ID");
    }

    const eventRequest = await (EventRequestModel as any).findById(params.id)
      .populate({
        path: "eventId",
        select: "title description date location participantsCount",
      })
      .populate({
        path: "userId",
        select: "firstName lastName email",
      })
      .lean() as any;

    if (!eventRequest) {
      return null;
    }

    if (!eventRequest.eventId) {
      throw new Error("Associated event not found");
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
