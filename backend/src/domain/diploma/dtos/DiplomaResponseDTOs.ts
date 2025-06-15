import { Diploma } from "../entities/Diploma";

export interface DiplomaSummaryDTO {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  duration: string;
  prerequisites: string[];
  status: boolean;
  createdAt: string;
  updatedAt: string;
  videoIds: string[];
}

export interface GetDiplomasResponseDTO {
  diplomas: DiplomaSummaryDTO[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface GetDiplomaByIdResponseDTO {
  diploma: Diploma;
}

export interface CreateDiplomaResponseDTO {
  diploma: Diploma;
}

export interface UpdateDiplomaResponseDTO {
  diploma: Diploma;
}

export interface EnrollStudentResponseDTO {
  success: boolean;
  message: string;
}

export interface UnenrollStudentResponseDTO {
  success: boolean;
  message: string;
} 