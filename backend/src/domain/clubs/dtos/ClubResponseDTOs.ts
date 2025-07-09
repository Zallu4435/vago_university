import { Club, ClubRequest, ClubProps } from "../entities/ClubTypes";

// Reusable types for Club responses
export type ClubSummaryData = Pick<ClubProps, 
  'name' | 'type' | 'members' | 'color' | 'icon'
> & {
  id: string;
  status: string;
  memberCount: number;
  image?: string;
};

// Reusable types for ClubRequest responses
export type ClubRequestSummaryData = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  clubId: string;
  clubName: string;
  clubType: string;
  clubDescription?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

// Generic pagination type
export interface PaginatedResponseDTO<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: T[];
}

// Response DTOs
export interface ClubSummaryDTO extends ClubSummaryData {}

export interface GetClubsResponseDTO extends PaginatedResponseDTO<ClubSummaryDTO> {
  data: ClubSummaryDTO[];
}

export interface GetClubByIdResponseDTO {
  club: Club;
}

export interface CreateClubResponseDTO {
  club: Club;
}

export interface UpdateClubResponseDTO {
  club: Club;
}

export interface JoinClubResponseDTO {
  message: string;
  club: Club;
}

export interface LeaveClubResponseDTO {
  message: string;
  club: Club;
}

export interface ClubRequestDTO extends ClubRequestSummaryData {}

export interface GetClubRequestsResponseDTO extends PaginatedResponseDTO<ClubRequestDTO> {
  data: ClubRequestDTO[];
}

export interface CreateClubRequestResponseDTO {
  message: string;
  request: ClubRequestDTO;
}

export interface ApproveClubRequestResponseDTO {
  message: string;
  request: ClubRequestDTO;
}

export interface RejectClubRequestResponseDTO {
  message: string;
  request: ClubRequestDTO;
}

export interface GetClubRequestDetailsResponseDTO {
  request: ClubRequestDTO;
} 
