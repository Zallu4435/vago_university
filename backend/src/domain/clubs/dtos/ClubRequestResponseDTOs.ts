import { ClubProps } from "../entities/ClubTypes";

// Reusable types for ClubRequest responses
export type SimplifiedClubRequestData = {
  clubName: string;
  requestedId: string;
  requestedBy: string;
  type: string;
  requestedAt: string;
  status: string;
};

export type ClubRequestDetailsData = {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  whyJoin: string;
  additionalInfo: string;
  club: Pick<ClubProps, 'name' | 'type' | 'about' | 'nextMeeting' | 'enteredMembers'> & { id: string };
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

// Generic pagination type (reusable)
export interface PaginatedResponseDTO<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

// Response DTOs
export interface SimplifiedClubRequestDTO extends SimplifiedClubRequestData {}

export interface GetClubRequestsResponseDTO {
  clubRequests: SimplifiedClubRequestDTO[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface ClubRequestDetailsDTO extends ClubRequestDetailsData {}

export interface GetClubRequestDetailsResponseDTO {
  clubRequest: ClubRequestDetailsDTO;
}