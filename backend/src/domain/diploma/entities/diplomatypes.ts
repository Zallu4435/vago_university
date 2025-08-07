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
  videos?: any[]; 
  createdAt: Date;
  updatedAt: Date;
} 

export interface DiplomaDocument {
  _id: any; 
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  duration: string;
  prerequisites: string[];
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  videoIds: any[];
  __v?: number;
}

export interface DiplomaListResult {
  diplomas: DiplomaDocument[];
  totalItems: number;
}

export interface DiplomaSummary {
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

export interface DiplomaList {
  diplomas: DiplomaSummary[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface OperationResult {
  success: boolean;
  message: string;
}

export interface EnrollStudent {
  diplomaId: string;
  studentId: string;
}

export interface UnenrollStudent {
  diplomaId: string;
  studentId: string;
} 

export interface UserDiplomaProps {
  userId: string;
  courseId: string;
  chapterId?: string;
  bookmarked?: boolean;
  progress?: number;
  completed?: boolean;
}

export class UserDiploma {
  public readonly userId: string;
  public readonly courseId: string;
  public readonly chapterId?: string;
  public bookmarked?: boolean;
  public progress?: number;
  public completed?: boolean;

  constructor(props: UserDiplomaProps) {
    this.userId = props.userId;
    this.courseId = props.courseId;
    this.chapterId = props.chapterId;
    this.bookmarked = props.bookmarked;
    this.progress = props.progress;
    this.completed = props.completed;
  }
} 