import httpClient from '../../../../../frameworks/api/httpClient';
import { DiplomaCourse, Chapter } from '../types/DiplomaTypes';

export const diplomaService = {
  getAllCourses: async (): Promise<DiplomaCourse[]> => {
    const response = await httpClient.get('/diploma-courses');
    return response.data;
  },

  getCourseById: async (courseId: string): Promise<DiplomaCourse> => {
    const response = await httpClient.get(`/diploma-courses/${courseId}`);
    return response.data;
  },

  getChapterById: async (courseId: string, chapterId: string): Promise<Chapter> => {
    const response = await httpClient.get(`/diploma-courses/${courseId}/chapters/${chapterId}`);
    return response.data;
  },

  updateVideoProgress: async (courseId: string, chapterId: string, progress: number): Promise<void> => {
    await httpClient.post(`/diploma-courses/${courseId}/chapters/${chapterId}/progress`, { progress });
  },

  markChapterComplete: async (courseId: string, chapterId: string): Promise<void> => {
    await httpClient.post(`/diploma-courses/${courseId}/chapters/${chapterId}/complete`);
  },

  toggleBookmark: async (courseId: string, chapterId: string): Promise<void> => {
    await httpClient.post(`/diploma-courses/${courseId}/chapters/${chapterId}/bookmark`);
  },

  getCompletedChapters: async (courseId: string): Promise<string[]> => {
    const response = await httpClient.get(`/diploma-courses/${courseId}/completed-chapters`);
    return response.data;
  },

  getBookmarkedChapters: async (courseId: string): Promise<string[]> => {
    const response = await httpClient.get(`/diploma-courses/${courseId}/bookmarked-chapters`);
    return response.data;
  }
}; 