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

export interface MaterialFilter {
  subject?: string;
  course?: string;
  semester?: number | string;
  type?: MaterialType;
  difficulty?: MaterialDifficulty;
  isRestricted?: boolean;
  uploadedBy?: string;
  uploadedAt?: {
    $gte?: Date;
    $lte?: Date;
  };
  $or?: Array<{
    title?: RegExp | { $regex: string; $options: string };
    description?: RegExp | { $regex: string; $options: string };
    subject?: RegExp | { $regex: string; $options: string };
    course?: RegExp | { $regex: string; $options: string };
    tags?: RegExp | { $regex: string; $options: string };
  }>;
}

export interface UserMaterialFilter {
  subject?: { $regex: string; $options: string };
  course?: string | { $regex: string; $options: string };
  semester?: string | number;
  type?: string;
  difficulty?: string;
  $or?: Array<{
    title?: { $regex: string; $options: string };
    subject?: { $regex: string; $options: string };
    uploadedBy?: { $regex: string; $options: string };
    course?: { $regex: string; $options: string };
    tags?: { $in: RegExp[] };
  }>;
  [key: string]: unknown;
}

export interface MaterialSortOptions {
  uploadedAt?: 1 | -1;
  downloads?: 1 | -1;
  views?: 1 | -1;
  rating?: 1 | -1;
  title?: 1 | -1;
  createdAt?: 1 | -1;
  [key: string]: 1 | -1 | undefined;
} 

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  path: string;
  mimetype: string;
  size: number;
}

export interface MaterialUpdateData {
  id: string;
  title?: string;
  description?: string;
  subject?: string;
  course?: string;
  semester?: string;
  tags?: string[];
  isNewMaterial?: boolean;
  isRestricted?: boolean;
  fileUrl?: string;
  thumbnailUrl?: string;
  [key: string]: unknown;
}
