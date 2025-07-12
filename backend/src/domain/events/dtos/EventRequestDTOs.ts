import { OrganizerType, EventType, Timeframe, EventStatus } from "../entities/EventTypes";

interface EventDataDTO {
  title: string;
  organizer: string;
  organizerType: OrganizerType;
  eventType: EventType;
  date: string;
  time: string;
  location: string;
  timeframe: Timeframe;
  status?: EventStatus;
  icon?: string;
  color?: string;
  description?: string;
  fullTime?: boolean;
  additionalInfo?: string;
  requirements?: string;
  maxParticipants?: number;
  registrationRequired?: boolean;
  participants?: number;
}

export interface GetEventsRequestDTO {
  page: number;
  limit: number;
  type: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  organizerType?: string;
  dateRange?: string;
}

export interface GetEventByIdRequestDTO {
  id: string;
}

export interface CreateEventRequestDTO extends EventDataDTO {}

export interface UpdateEventRequestDTO {
  id: string;
  title?: string;
  organizer?: string;
  organizerType?: OrganizerType;
  eventType?: EventType;
  date?: string;
  time?: string;
  location?: string;
  timeframe?: Timeframe;
  status?: EventStatus;
  icon?: string;
  color?: string;
  description?: string;
  fullTime?: boolean;
  additionalInfo?: string;
  requirements?: string;
  maxParticipants?: number;
  registrationRequired?: boolean;
  participants?: number;
}

export interface DeleteEventRequestDTO {
  id: string;
}