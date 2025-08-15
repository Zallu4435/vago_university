export enum MaterialType {
  PDF = "pdf",
  VIDEO = "video"
}

export enum MaterialDifficulty {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced"
}

export interface MaterialProps {
  id?: string;
  title: string;
  description: string;
  subject: string;
  course: string;
  semester: string;
  type: MaterialType;
  fileUrl: string;
  thumbnailUrl: string;
  tags: string[];
  difficulty: MaterialDifficulty;
  estimatedTime: string;
  isNewMaterial: boolean;
  isRestricted: boolean;
  uploadedBy: string;
  uploadedAt: string;
  views: number;
  downloads: number;
  rating: number;
}

export type CreateMaterialProps = Omit<MaterialProps, 'id' | 'uploadedAt' | 'views' | 'downloads' | 'rating'>;
export type UpdateMaterialProps = Partial<Omit<MaterialProps, 'uploadedAt' | 'views' | 'downloads' | 'rating'>> & { id?: string }; 