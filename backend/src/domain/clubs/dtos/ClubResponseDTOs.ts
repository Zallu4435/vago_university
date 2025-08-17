import { Club, ClubRequest, ClubProps } from "../entities/ClubTypes";

export interface RepositoryClubData {
  _id: string;
  name: string;
  type: string;
  status: string;
  createdBy?: string;
  description?: string;
  members?: string[];
  color?: string;
  icon?: string;
  nextMeeting?: string;
  about?: string;
  enteredMembers?: number;
  upcomingEvents?: { date: string; description: string }[];
  role?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type ClubSummaryData = Pick<ClubProps, 
  'name' | 'type' | 'members' | 'color' | 'icon'
> & {
  id: string;
  status: string;
  memberCount: number;
  image?: string;
};

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

export interface PaginatedResponseDTO<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: T[];
}

export interface ClubSummaryDTO extends ClubSummaryData {}

export interface GetClubsResponseDTO {
  clubs: ClubSummaryDTO[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface GetClubByIdResponseDTO {
  club: RepositoryClubData;
}

export interface CreateClubResponseDTO {
  club: RepositoryClubData;
}

export interface UpdateClubResponseDTO {
  club: RepositoryClubData;
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
