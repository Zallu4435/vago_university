import httpClient from '../../frameworks/api/httpClient';
import { Chapter, DiplomaApiResponse } from '../../domain/types/diploma';


class DiplomaService {
    async getDiplomaCourses(
        page: number,
        limit: number,
        category?: string,
        status?: string,
        dateRange?: string
    ): Promise<DiplomaApiResponse> {
        try {
            const params: Record<string, string | number> = { page, limit };
            if (category && category !== 'all') params.category = category;
            if (status && status !== 'all') params.status = status;
            if (dateRange && dateRange !== 'all') {
                const [startDate, endDate] = dateRange.split(',');
                params.startDate = startDate;
                params.endDate = endDate;
            }

            const response = await httpClient.get<DiplomaApiResponse>('/diploma-courses', { params });
            return response.data.data;
        } catch (error: any) {
            console.error('getDiplomaCourses error:', error);
            throw new Error(error.response?.data?.error || 'Failed to fetch diploma courses');
        }
    }

    async getDiplomaCourseById(id: string): Promise<any> {
        try {
            const response = await httpClient.get<{ course: any }>(`/diploma-courses/${id}`);
            console.log('[DiplomaService] getDiplomaCourseById response:', response.data);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to fetch diploma course');
        }
    }

    async getChapterById(courseId: string, chapterId: string): Promise<Chapter> {
        try {
            const response = await httpClient.get<{ chapter: Chapter }>(`/diploma-courses/${courseId}/chapters/${chapterId}`);
            console.log(response.data, "oooooooooooooooooooooooooooooooooomb")
            return response.data.data.chapter;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to fetch chapter');
        }
    }

    async updateVideoProgress(courseId: string, chapterId: string, progress: number): Promise<void> {
        try {
            await httpClient.post(`/diploma-courses/${courseId}/chapters/${chapterId}/progress`, { progress });
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to update video progress');
        }
    }

    async markChapterComplete(courseId: string, chapterId: string): Promise<void> {
        try {
            await httpClient.post(`/diploma-courses/${courseId}/chapters/${chapterId}/complete`);
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to mark chapter as complete');
        }
    }

    async toggleBookmark(courseId: string, chapterId: string): Promise<void> {
        try {
            await httpClient.post(`/diploma-courses/${courseId}/chapters/${chapterId}/bookmark`);
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to toggle bookmark');
        }
    }

    async getCompletedChapters(courseId: string): Promise<string[]> {
        try {
            const response = await httpClient.get<{ completedChapters: string[] }>(`/diploma-courses/${courseId}/completed-chapters`);
            return response.data.data.chapters;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to fetch completed chapters');
        }
    }

    async getBookmarkedChapters(courseId: string): Promise<string[]> {
        try {
            const response = await httpClient.get<{ bookmarkedChapters: string[] }>(`/diploma-courses/${courseId}/bookmarked-chapters`);
            return response.data.data.chapters;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to fetch bookmarked chapters');
        }
    }
}

export const diplomaService = new DiplomaService();