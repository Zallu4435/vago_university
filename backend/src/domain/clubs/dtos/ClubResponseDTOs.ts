import { Club } from "../entities/Club";
import { ClubRequest, ClubRequestStatus } from "../entities/ClubRequest";

export interface ClubSummaryDTO {
  id: string;
  name: string;
  type: string;
  status: string;
  memberCount: number;
  image?: string;
}

export interface GetClubsResponseDTO {
  data: ClubSummaryDTO[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
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

export interface ClubRequestDTO {
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
}

export interface GetClubRequestsResponseDTO {
  data: ClubRequestDTO[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
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
