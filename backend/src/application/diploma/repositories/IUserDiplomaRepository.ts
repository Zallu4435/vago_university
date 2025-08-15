import { DiplomaCourse, Chapter } from "../../../domain/diploma/entities/diplomatypes";
 
export interface IUserDiplomaRepository {
  getUserDiplomas(userId: string, page: number, limit: number, category: string, status: string, dateRange: string): Promise<{
    courses: DiplomaCourse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  getUserDiplomaById(id: string): Promise<DiplomaCourse | null>;
  getUserDiplomaChapter(courseId: string, chapterId: string): Promise<Chapter | null>;
  updateVideoProgress(userId: string, courseId: string, chapterId: string, progress: number): Promise<{
    message: string;
    progress: number;
  }>;
  markChapterComplete(userId: string, courseId: string, chapterId: string): Promise<{
    message: string;
    completed: boolean;
  }>;
  toggleBookmark(userId: string, courseId: string, chapterId: string): Promise<{
    message: string;
    bookmarked: boolean;
  }>;
  getCompletedChapters(userId: string, courseId: string): Promise<string[]>;
  getBookmarkedChapters(userId: string, courseId: string): Promise<string[]>;
} 