import { DiplomaCourse } from '../entities/DiplomaCourse';
import { Chapter } from '../entities/Chapter';

export interface GetUserDiplomasResponseDTO {
  courses: DiplomaCourse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetUserDiplomaByIdResponseDTO extends DiplomaCourse {}

export interface GetUserDiplomaChapterResponseDTO extends Chapter {}

export interface UpdateVideoProgressResponseDTO {
  message: string;
  progress: number;
}

export interface MarkChapterCompleteResponseDTO {
  message: string;
  completed: boolean;
}

export interface ToggleBookmarkResponseDTO {
  message: string;
  bookmarked: boolean;
}

export interface GetCompletedChaptersResponseDTO {
  chapters: string[];
}

export interface GetBookmarkedChaptersResponseDTO {
  chapters: string[];
} 