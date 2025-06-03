import { Club } from "../entities/Club";

interface PaginatedResponseDTO<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface ClubSummaryDTO {
  id: string;
  name: string;
  type: string;
  createdBy: string;
  status: string;
  createdAt: string;
}

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