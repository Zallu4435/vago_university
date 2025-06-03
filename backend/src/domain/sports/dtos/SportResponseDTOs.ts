import { Sport } from "../entities/Sport";
import { SportRequest } from "../entities/SportRequest";

export interface SportSummaryDTO {
  id: string;
  title: string;
  type: string;
  headCoach: string;
  playerCount: number;
  status: string;
  formedOn: string;
  logo: string;
  division?: string;
  participants?: number;
  icon?: string;
  color?: string;
  createdAt: string;
}

export interface GetSportsResponseDTO {
  sports: SportSummaryDTO[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
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

export interface SimplifiedSportRequestDTO {
  sportName: string;
  requestId: string;
  requestedBy: string;
  type: string;
  requestedAt: string;
  status: string;
}

export interface GetSportRequestsResponseDTO {
  requests: SimplifiedSportRequestDTO[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface GetSportRequestDetailsResponseDTO {
  sportRequest: {
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    whyJoin: string;
    additionalInfo: string;
    sport: {
      id: string;
      title: string;
      type: string;
      headCoach: string;
      playerCount: number;
      division: string;
    };
    user?: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface JoinSportResponseDTO {
  requestId: string;
  status: string;
  message: string;
} 