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
} from "../../../domain/events/entities/EventRequest";
import { EventRequestStatus } from "../../../domain/events/entities/EventTypes";

// Repository Implementation (UPDATED: Pure data access, no business logic)
export class EventsRepository implements IEventsRepository {
  async getEvents(params: GetEventsRequestDTO): Promise<any> {
    const { page, limit, type, status, startDate, endDate } = params;
    const query: any = {};
    if (type !== "all") query.eventType = type;
    if (status !== "all") query.status = status;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate.toISOString().split('T')[0];
      if (endDate) query.date.$lte = endDate.toISOString().split('T')[0];
    }
    const skip = (page - 1) * limit;
    const events = await (CampusEventModel as any).find(query).skip(skip).limit(limit).lean();
    const totalItems = await (CampusEventModel as any).countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    return { events, totalItems, totalPages, currentPage: page };
  }

  async getEventById(params: GetEventByIdRequestDTO): Promise<any> {
    return await (CampusEventModel as any).findById(params.id).lean();
  }

  async createEvent(params: CreateEventRequestDTO): Promise<any> {
    return await (CampusEventModel as any).create(params);
  }

  async updateEvent(params: UpdateEventRequestDTO): Promise<any> {
    return await (CampusEventModel as any).findByIdAndUpdate(
      params.id,
      { $set: params },
      { new: true }
    ).lean();
  }

  async deleteEvent(params: DeleteEventRequestDTO): Promise<void> {
    await (CampusEventModel as any).findByIdAndDelete(params.id);
  }

  async getEventRequests(
    params: GetEventRequestsRequestDTO
  ): Promise<any> {
    const { page, limit, status, startDate, endDate, type } = params;
    const query: any = {};
    if (status !== "all") {
      query.status = status;
    }
    const eventQuery: any = {};
    if (type && type.toLowerCase() !== "all") {
      eventQuery.eventType = type;
    }
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
    return {
      rawRequests,
      totalItems,
      totalPages,
      currentPage: page,
    };
  }

  async approveEventRequest(
    params: ApproveEventRequestRequestDTO
  ): Promise<void> {
    // Update event request status
    await (EventRequestModel as any).findByIdAndUpdate(
      params.id,
      { status: EventRequestStatus.Approved, updatedAt: new Date() },
      { runValidators: true }
    );

    // Get the event request to find the associated event
    const eventRequest = await (EventRequestModel as any).findById(params.id);
    if (eventRequest && eventRequest.eventId) {
      // Increment participants count
      await (CampusEventModel as any).findByIdAndUpdate(
        eventRequest.eventId,
        { $inc: { participantsCount: 1 } },
        { new: true }
      );
    }
  }

  async rejectEventRequest(
    params: RejectEventRequestRequestDTO
  ): Promise<void> {
    await (EventRequestModel as any).findByIdAndUpdate(
      params.id,
      { status: EventRequestStatus.Rejected, updatedAt: new Date() },
      { runValidators: true }
    );
  }

  async getEventRequestDetails(
    params: GetEventRequestDetailsRequestDTO
  ): Promise<any> {
    return await (EventRequestModel as any).findById(params.id)
      .populate({
        path: "eventId",
        select: "title description date location participantsCount",
      })
      .populate({
        path: "userId",
        select: "firstName lastName email",
      })
      .lean();
  }
}
