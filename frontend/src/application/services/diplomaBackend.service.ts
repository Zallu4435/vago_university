import { Diploma, Enrollment } from '../../domain/types/management/diplomamanagement';
import { Video } from '../../domain/types/management/videomanagement';
import httpClient from '../../frameworks/api/httpClient';



export const diplomaBackendService = {
    async getDiplomas(page: number, limit: number): Promise<{ diplomas: Diploma[]; totalPages: number }> {
        const response = await httpClient.get('/admin/diploma-courses', { params: { page, limit } });
        return {
            diplomas: response.data.data.diplomas,
            totalPages: response.data.data.totalPages,
        };
    },

    async getVideos(category?: string, page: number = 1, limit: number = 10, status?: string): Promise<{ videos: Video[]; totalPages: number }> {
        const params: any = { page, limit };
        if (status && status !== 'all') params.status = status;
        if (category && category !== 'all') params.category = category;

        const response = await httpClient.get('/admin/vedio/videos', { params });
        return {
            videos: response.data.data.data,
            totalPages: response.data.data.totalPages,
        };
    },

    async getVideoById(videoId: string): Promise<Video> {
        const response = await httpClient.get(`/admin/vedio/videos/${videoId}`);
        return response.data.data.video;
    },

    async createVideo(category: string, videoData: FormData): Promise<Video> {
        if (!category) {
            throw new Error('Category is required for video creation');
        }
        const response = await httpClient.post(`/admin/vedio/categories/${category}/videos`, videoData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 60000, // 1 minute timeout for video uploads
        });
        return response.data.video;
    },

    async updateVideo(videoId: string, videoData: Partial<Video> | FormData): Promise<Video> {
        if (!videoId) {
            throw new Error('Video ID is required for updates');
        }
                
        const isFormData = videoData instanceof FormData;
        
        if (!isFormData) {
            console.log('diplomaBackendService: videoData.videoUrl =', (videoData as Partial<Video>).videoUrl);
        }
        
        const config = isFormData ? {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 60000,
        } : {};
        
        const response = await httpClient.put(`/admin/vedio/videos/${videoId}`, videoData, config);
        return response.data.video;
    },

    async deleteVideo(videoId: string): Promise<void> {
        if (!videoId) {
            throw new Error('Video ID is required for deletion');
        }
        await httpClient.delete(`/admin/vedio/videos/${videoId}`);
    },

    async getEnrollments(page: number, limit: number, category?: string, status?: string): Promise<{ enrollments: Enrollment[]; totalPages: number }> {
        const params: any = { page, limit };
        if (category && category !== 'All Categories') params.category = category;
        if (status && status !== 'All') params.status = status;
        const response = await httpClient.get('/admin/diploma-enrollments', { params });
        return {
            enrollments: response.data.enrollments,
            totalPages: response.data.totalPages,
        };
    },

    async getDiplomaDetails(diplomaId: string): Promise<Diploma & { enrolledStudents: Enrollment[] }> {
        const response = await httpClient.get(`/admin/diploma-courses/${diplomaId}`);
        return response.data.data.diploma;
    },

    async getEnrollmentDetails(enrollmentId: string): Promise<Enrollment> {
        const response = await httpClient.get(`/admin/diploma-enrollments/${enrollmentId}`);
        return response.data.enrollment;
    },

    async createDiploma(data: Omit<Diploma, '_id' | 'createdAt' | 'updatedAt'>): Promise<Diploma> {
        const response = await httpClient.post('/admin/diploma-courses', data);
        return response.data.diploma;
    },

    async updateDiploma(id: string, data: Partial<Diploma>): Promise<Diploma> {
        const response = await httpClient.put(`/admin/diploma-courses/${id}`, data);
        return response.data.diploma;
    },

    async deleteDiploma(id: string): Promise<void> {
        await httpClient.delete(`/admin/diploma-courses/${id}`);
    },

    async approveEnrollment(requestId: string): Promise<void> {
        await httpClient.post(`/admin/diploma-enrollments/${requestId}/approve`);
    },

    async rejectEnrollment(requestId: string, reason: string): Promise<void> {
        await httpClient.post(`/admin/diploma-enrollments/${requestId}/reject`, { reason });
    },

    async resetProgress(requestId: string): Promise<void> {
        await httpClient.post(`/admin/diploma-enrollments/${requestId}/reset-progress`);
    },
}; 