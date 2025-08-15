import { DiplomaCourse, Chapter } from '../entities/diplomatypes';

export interface GetUserDiplomasResponseDTO {
  courses: DiplomaCourse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type GetUserDiplomaByIdResponseDTO = DiplomaCourse;

export type GetUserDiplomaChapterResponseDTO = Chapter;

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