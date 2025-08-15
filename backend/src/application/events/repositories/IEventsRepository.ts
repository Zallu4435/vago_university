import { 
  PaginatedResponse, 
  EventSummary, 
  EventDocument, 
  EventRequestDocument,
  CreateEventDto,
  UpdateEventDto,
  EventFilter,
} from "../../../domain/events/entities/Event";
import { IBaseRepository } from "../../repositories";

export interface IEventsRepository extends 
  IBaseRepository<EventDocument, CreateEventDto, UpdateEventDto, EventFilter, EventDocument> {
  
  getEvents(page: number, limit: number, type: string, status: string, startDate: string, endDate: string, search: string, organizerType: string, dateRange: string): Promise<PaginatedResponse<EventSummary>>;
  
  // getEventById(id: string): Promise<EventDocument | null>;        // Use getById() instead
  // createEvent(event: Event): Promise<EventDocument>;              // Use create() instead  
  // updateEvent(event: Event): Promise<EventDocument | null>;      // Use updateById() instead
  // deleteEvent(id: string): Promise<void>;                        // Use deleteById() instead

  // Event request management operations
  getEventRequests(page: number, limit: number, status: string, startDate: string, endDate: string, type: string, search: string, organizerType: string, dateRange: string): Promise<PaginatedResponse<EventRequestDocument>>;
  approveEventRequest(id: string): Promise<void>;
  rejectEventRequest(id: string): Promise<void>;
  getEventRequestDetails(id: string): Promise<EventRequestDocument | null>;
}