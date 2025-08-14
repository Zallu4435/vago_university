export interface Video {
    _id: string;
    title: string;
    duration: string;
    uploadedAt: string;
    module: number;
    status: 'Draft' | 'Published';
    diplomaId: string;
    description: string;
  }
  
  export interface Diploma {
    _id: string;
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
    videoIds: string[]; // References to video IDs
  }

export interface Chapter {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  notes: string;
  type: 'video' | 'interactive' | 'quiz' | 'project';
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
  videoCount?: number;
  completedVideoCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DiplomaApiResponse {
  data: {
    courses: DiplomaCourse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DiplomaCourseResponse {
  data: DiplomaCourse;
}

export interface ChapterResponse {
  data: {
    chapter: Chapter;
  };
}

export interface CompletedChaptersResponse {
  data: {
    chapters: string[];
  };
}

export interface BookmarkedChaptersResponse {
  data: {
    chapters: string[];
  };
}

export interface VideoProgress {
  chapterId: string;
  progress: number;
  completed: boolean;
}

export type ViewMode = 'courses' | 'details' | 'chapter';
export type ChapterType = 'video' | 'interactive' | 'quiz' | 'project';