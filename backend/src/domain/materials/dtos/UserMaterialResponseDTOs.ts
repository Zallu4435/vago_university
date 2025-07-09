import { MaterialType, MaterialDifficulty, MaterialProps } from "../entities/MaterialTypes";

export interface GetUserMaterialsResponseDTO {
  materials: Array<Pick<MaterialProps, 'id' | 'title' | 'description' | 'subject' | 'course' | 'semester' | 'type' | 'fileUrl' | 'thumbnailUrl' | 'tags' | 'difficulty' | 'estimatedTime' | 'isNewMaterial' | 'isRestricted' | 'uploadedBy' | 'uploadedAt' | 'views' | 'downloads' | 'rating'>>;
  totalPages: number;
  bookmarkedMaterials: string[];
  likedMaterials: string[];
} 