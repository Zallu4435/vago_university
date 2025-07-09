export enum DiplomaStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DRAFT = "draft",
  COMPLETED = "completed"
}

export interface DiplomaProps {
  id?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  duration: string;
  prerequisites: string[];
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  videoIds?: string[];
} 

export interface Chapter {
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
    duration: number;
    order: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
  } 

export interface DiplomaCourse {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  instructor: string;
  department: string;
  chapters: Chapter[];
  // videos?: Video[]; // Uncomment and import Video if needed
  videos?: any[]; // Placeholder for Video type
  createdAt: Date;
  updatedAt: Date;
} 