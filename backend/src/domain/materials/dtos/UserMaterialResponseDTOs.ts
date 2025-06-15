import { MaterialProps } from '../entities/Material';

export interface GetUserMaterialsResponseDTO {
  materials: MaterialProps[];
  totalPages: number;
  bookmarkedMaterials: string[];
  likedMaterials: string[];
} 