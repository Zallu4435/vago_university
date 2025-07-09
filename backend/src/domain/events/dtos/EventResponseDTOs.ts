import { Event } from "../entities/Event";
import { OrganizerType, EventType, Timeframe, EventStatus } from "../entities/EventTypes";

interface PaginatedResponseDTO<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface EventSummaryDTO {
  id: string;
  title: string;
  organizerType: OrganizerType;
  eventType: EventType;
  location: string;
  timeframe: Timeframe;
  status: EventStatus;
}

export interface GetEventsResponseDTO extends PaginatedResponseDTO<EventSummaryDTO> {
  data: EventSummaryDTO[];
}

export interface GetEventByIdResponseDTO {
  event: Event;
}

export interface CreateEventResponseDTO {
  event: Event;
}

export interface UpdateEventResponseDTO {
  event: Event;
}