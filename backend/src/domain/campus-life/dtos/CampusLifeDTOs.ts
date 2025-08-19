import { CampusEvent, Sport, Club } from "../entities/CampusLife";

export interface GetCampusLifeOverviewRequestDTO {}

export interface GetEventsRequestDTO {
  page: number;
  limit: number;
  search: string;
  status: 'upcoming' | 'past' | 'all';
  userId?: string;
}

export interface GetEventByIdRequestDTO {
  eventId: string;
}

export interface GetSportsRequestDTO {
  type?: 'VARSITY SPORTS' | 'INTRAMURAL SPORTS';
  search: string;
  userId?: string;
}

export interface GetSportByIdRequestDTO {
  sportId: string;
}

export interface GetClubsRequestDTO {
  search: string;
  type?: string;
  status: 'active' | 'inactive' | 'all';
  userId?: string;
}

export interface GetClubByIdRequestDTO {
  clubId: string;
}

export interface JoinClubRequestDTO {
  clubId: string;
  studentId: string;
  reason: string;
  additionalInfo?: string;
}

export interface JoinSportRequestDTO {
  sportId: string;
  studentId: string;
  reason: string;
  additionalInfo?: string;
}

export interface JoinEventRequestDTO {
  eventId: string;
  studentId: string;
  reason: string;
  additionalInfo?: string;
}

export interface CampusLifeOverviewResponseDTO {
  events: CampusEvent[];
  sports: Sport[];
  clubs: Club[];
}

export interface GetEventsResponseDTO {
  events: CampusEvent[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface GetEventByIdResponseDTO {
  event: CampusEvent;
}

export interface GetSportsResponseDTO {
  sports: Sport[];
  totalItems: number;
}

export interface GetSportByIdResponseDTO {
  sport: Sport;
}

export interface GetClubsResponseDTO {
  clubs: Club[];
  totalItems: number;
}

export interface GetClubByIdResponseDTO {
  club: Club;
}

export interface JoinClubResponseDTO {
  requestId: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
}

export interface JoinSportResponseDTO {
  requestId: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
}

export interface JoinEventResponseDTO {
  requestId: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
}

export interface ResponseDTO<T> {
  success: boolean;
  data: T | { error: string };
}