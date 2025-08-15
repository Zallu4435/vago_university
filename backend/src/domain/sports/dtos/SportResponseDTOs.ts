import { Sport, SportRequest, SportProps } from "../entities/SportTypes";

// Reusable types for Sport responses
export type SportSummaryData = Pick<SportProps, 
  'title' | 'type' | 'headCoach' | 'playerCount' | 'formedOn' | 'logo' | 'division' | 'participants' | 'icon' | 'color'
> & {
  id: string;
  status: string;
  createdAt: string;
};

// Reusable types for SportRequest responses
export type SportRequestSummaryData = {
  sportName: string;
  requestId: string;
  requestedBy: string;
  type: string;
  requestedAt: string;
  status: string;
};

export type SportRequestDetailsData = {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  whyJoin: string;
  additionalInfo: string;
  sport: Pick<SportProps, 'title' | 'type' | 'headCoach' | 'playerCount' | 'division'> & { id: string };
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

// Generic pagination type
export interface PaginatedResponseDTO<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: T[];
}

// Response DTOs
export interface SportSummaryDTO extends SportSummaryData {
  _id?: string;
}

export interface GetSportsResponseDTO extends PaginatedResponseDTO<SportSummaryDTO> {
}

export interface GetSportByIdResponseDTO {
  sport: Sport;
}

export interface CreateSportResponseDTO {
  sport: Sport;
}

export interface UpdateSportResponseDTO {
  sport: Sport;
}

export interface SimplifiedSportRequestDTO extends SportRequestSummaryData {}

export interface GetSportRequestsResponseDTO extends PaginatedResponseDTO<SimplifiedSportRequestDTO> {
  requests: SimplifiedSportRequestDTO[];
}

export interface GetSportRequestDetailsResponseDTO {
  sportRequest: SportRequestDetailsData;
}

export interface JoinSportResponseDTO {
  requestId: string;
  status: string;
  message: string;
} 