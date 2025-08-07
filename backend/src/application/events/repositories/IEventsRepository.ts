import { Event, PaginatedResponse, EventSummary, SimplifiedEventRequest, EventRequestDetails, EventDocument } from "../../../domain/events/entities/Event";

export interface IEventsRepository {
  getEvents(page: number, limit: number, type: string, status: string, startDate: string, endDate: string, search: string, organizerType: string, dateRange: string): Promise<PaginatedResponse<EventSummary>>;
  getEventById(id: string): Promise<Event | null>;
  createEvent(event: Event): Promise<EventDocument>;
  updateEvent(event: Event): Promise<Event | null>;
  deleteEvent(id: string): Promise<void>;

  getEventRequests(page: number, limit: number, status: string, startDate: string, endDate: string, type: string, search: string, organizerType: string, dateRange: string): Promise<PaginatedResponse<SimplifiedEventRequest>>;
  approveEventRequest(id: string): Promise<void>;
  rejectEventRequest(id: string): Promise<void>;
  getEventRequestDetails(id: string): Promise<EventRequestDetails | null>;
}