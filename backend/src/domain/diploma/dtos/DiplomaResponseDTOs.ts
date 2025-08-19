import { Diploma } from "../entities/Diploma";
import { DiplomaProps } from "../entities/diplomatypes";

export type DiplomaSummaryDTO = Pick<DiplomaProps, 'id' | 'title' | 'description' | 'price' | 'category' | 'thumbnail' | 'duration' | 'prerequisites' | 'status' | 'createdAt' | 'updatedAt' | 'videoIds'> & {
  createdAt: string;
  updatedAt: string;
  videoIds: string[];
};

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

export interface ResponseDTO<T> {
  data: T;
  success: boolean;
}
