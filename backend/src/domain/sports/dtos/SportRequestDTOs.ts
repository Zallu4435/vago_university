import { SportProps, SportRequestProps, SportStatus, SportRequestStatus } from "../entities/SportTypes";

// Reusable types for Sport
export type SportDataDTO = Pick<SportProps, 
  'title' | 'type' | 'headCoach' | 'playerCount' | 'formedOn' | 'logo' | 'division'
> & {
  status?: SportStatus;
  category: string;
  organizer: string;
  organizerType: string;
  icon: string;
  color: string;
  homeGames: number;
  record: string;
  upcomingGames: { date: string; description: string }[];
  participants: number;
};

// Reusable types for SportRequest
export type SportRequestDataDTO = Pick<SportRequestProps, 
  'sportId' | 'userId' | 'whyJoin' 
> & {
  additionalInfo?: string;
  studentId?: string; // <-- Add this line
  reason?: string; // Optional field for join requests
};

// Request DTOs
export interface GetSportsRequestDTO {
  page: number;
  limit: number;
  sportType: string;
  status: string;
  coach: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface GetSportByIdRequestDTO {
  id: string;
}

export interface CreateSportRequestDTO extends SportDataDTO {}

export type UpdateSportRequestDTO = {
  id: string;
} & Partial<SportDataDTO>;

export interface DeleteSportRequestDTO {
  id: string;
}

export interface GetSportRequestsRequestDTO {
  page: number;
  limit: number;
  status: string;
  type: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface ApproveSportRequestRequestDTO {
  id: string;
}

export interface RejectSportRequestRequestDTO {
  id: string;
}

export interface GetSportRequestDetailsRequestDTO {
  id: string;
}

export interface JoinSportRequestDTO {
  sportId: string;
  studentId: string;
  reason: string;
  additionalInfo?: string;
}