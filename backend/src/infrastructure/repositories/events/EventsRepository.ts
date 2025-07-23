import {
  GetEventByIdRequestDTO,
  CreateEventRequestDTO,
  UpdateEventRequestDTO,
  DeleteEventRequestDTO,
  GetEventsRequestDTO,
} from "../../../domain/events/dtos/EventRequestDTOs";
import {
  GetEventRequestsRequestDTO,
  RejectEventRequestRequestDTO,
  GetEventRequestDetailsRequestDTO,
  ApproveEventRequestRequestDTO,
} from "../../../domain/events/dtos/EventRequestRequestDTOs";
import { IEventsRepository } from "../../../application/events/repositories/IEventsRepository";
import {
  CampusEventModel,
  EventRequestModel,
} from "../../../infrastructure/database/mongoose/models/events/CampusEventModel";
import { EventRequestStatus } from "../../../domain/events/entities/EventTypes";

export class EventsRepository implements IEventsRepository {
  async getEvents(params: GetEventsRequestDTO): Promise<any> {
    const { page, limit, type, status, startDate, endDate, search, organizerType, dateRange } = params;
    const query: any = {};
    
    if (type && type !== "all") {
      query.eventType = { $regex: `^${type}$`, $options: "i" };
    }
    
    if (status && status !== "all") {
      query.status = { $regex: `^${status}$`, $options: "i" };
    }
    
    if (organizerType && organizerType !== "all") {
      query.organizerType = { $regex: `^${organizerType}$`, $options: "i" };
    }

    if (dateRange && dateRange !== "all") {
      const now = new Date();
      let calculatedStartDate: Date;
      
      switch (dateRange) {
        case "last_week":
          calculatedStartDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "last_month":
          calculatedStartDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case "last_3_months":
          calculatedStartDate = new Date(now.setDate(now.getDate() - 90));
          break;
        case "last_6_months":
          calculatedStartDate = new Date(now.setDate(now.getDate() - 180));
          break;
        case "last_year":
          calculatedStartDate = new Date(now.setDate(now.getDate() - 365));
          break;
        default:
          calculatedStartDate = now;
      }
      
      query.date = { $gte: calculatedStartDate.toISOString().split('T')[0] };
    } else if (startDate || endDate) {
      // Custom date range
      query.date = {};
      if (startDate) query.date.$gte = startDate.toISOString().split('T')[0];
      if (endDate) query.date.$lte = endDate.toISOString().split('T')[0];
    }

    // Search functionality
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
        { organizer: { $regex: search.trim(), $options: "i" } },
        { location: { $regex: search.trim(), $options: "i" } },
        { additionalInfo: { $regex: search.trim(), $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;
    const events = await (CampusEventModel as any).find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
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
    const { page, limit, status, startDate, endDate, type, search, organizerType, dateRange } = params;
    const query: any = {};
    
    if (status && status !== "all") {
      query.status = { $regex: `^${status}$`, $options: "i" };
    }
    
    const eventQuery: any = {};
    
    if (type && type.toLowerCase() !== "all") {
      eventQuery.eventType = { $regex: `^${type}$`, $options: "i" };
    }
    
    if (organizerType && organizerType !== "all") {
      eventQuery.organizerType = { $regex: `^${organizerType}$`, $options: "i" };
    }

    if (dateRange && dateRange !== "all") {
      const now = new Date();
      let calculatedStartDate: Date;
      
      switch (dateRange) {
        case "last_week":
          calculatedStartDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "last_month":
          calculatedStartDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case "last_3_months":
          calculatedStartDate = new Date(now.setDate(now.getDate() - 90));
          break;
        case "last_6_months":
          calculatedStartDate = new Date(now.setDate(now.getDate() - 180));
          break;
        case "last_year":
          calculatedStartDate = new Date(now.setDate(now.getDate() - 365));
          break;
        default:
          calculatedStartDate = now;
      }
      
      eventQuery.date = { $gte: calculatedStartDate.toISOString().split('T')[0] };
    } else if (startDate || endDate) {
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

    if (search && search.trim()) {
      eventQuery.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
        { organizer: { $regex: search.trim(), $options: "i" } },
        { location: { $regex: search.trim(), $options: "i" } },
        { additionalInfo: { $regex: search.trim(), $options: "i" } }
      ];
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
        select: "title eventType date organizer location description",
        match: eventQuery
      })
      .populate("userId", "firstName lastName email")
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
    await (EventRequestModel as any).findByIdAndUpdate(
      params.id,
      { status: EventRequestStatus.Approved, updatedAt: new Date() },
      { runValidators: true }
    );

    const eventRequest = await (EventRequestModel as any).findById(params.id);
    if (eventRequest && eventRequest.eventId) {
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
