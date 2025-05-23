// src/application/services/course.service.ts
import httpClient from '../../frameworks/api/httpClient';
import { Course, CourseApiResponse, CourseDetails } from '../../domain/types/course';

class CourseService {
  async getCourses(
    page: number,
    limit: number,
    specialization?: string,
    faculty?: string,
    term?: string
  ): Promise<CourseApiResponse> {
    try {
      const response = await httpClient.get<CourseApiResponse>('/admin/courses', {
        params: { page, limit, specialization, faculty, term },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch courses');
    }
  }

  async getCourseDetails(id: string): Promise<CourseDetails> {
    try {
      const response = await httpClient.get<CourseDetails>(`/admin/courses/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch course details');
    }
  }

  async createCourse(data: Omit<Course, 'id' | 'currentEnrollment'>): Promise<Course> {
    try {
      const response = await httpClient.post<Course>('/admin/courses', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create course');
    }
  }

  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    try {
      const response = await httpClient.put<Course>(`/admin/courses/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update course');
    }
  }

  async deleteCourse(id: string): Promise<void> {
    try {
      await httpClient.delete(`/admin/courses/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete course');
    }
  }

  async getEnrollmentRequests(
    courseId: string,
    page: number,
    limit: number,
    status?: string
  ): Promise<CourseApiResponse> {
    try {
      const response = await httpClient.get<CourseApiResponse>(`/admin/courses/${courseId}/enrollments`, {
        params: { page, limit, status },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch enrollment requests');
    }
  }

  async approveEnrollment(courseId: string, enrollmentId: string): Promise<void> {
    try {
      await httpClient.post(`/admin/courses/${courseId}/enrollments/${enrollmentId}/approve`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to approve enrollment');
    }
  }

  async rejectEnrollment(courseId: string, enrollmentId: string, reason: string): Promise<void> {
    try {
      await httpClient.post(`/admin/courses/${courseId}/enrollments/${enrollmentId}/reject`, { reason });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to reject enrollment');
    }
  }
}

export const courseService = new CourseService();