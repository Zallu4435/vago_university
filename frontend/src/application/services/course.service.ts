import httpClient from "../../frameworks/api/httpClient";
import {
  Course,
  CourseApiResponse,
  CourseApiWrapper,
  CourseDetails,
  CourseDetailsResponse,
  EnrollmentRequest,
  EnrollmentRequestsResponse,
  EnrollmentRequestDetailsResponse,
} from "../../domain/types/course";
import { isAxiosErrorWithApiError } from '../../shared/types/apiError';

class CourseService {
  async getCourses(
    page: number,
    limit: number,
    specialization?: string,
    faculty?: string,
    term?: string,
    search?: string
  ): Promise<CourseApiResponse> {
    try {
      const response = await httpClient.get<CourseApiWrapper>(
        "/admin/courses",
        {
          params: { page, limit, specialization, faculty, term, search },
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || "Failed to fetch courses");
      }
      throw new Error("Failed to fetch courses");
    }
  }

  async getCourseDetails(courseId: string): Promise<{ course: CourseDetails }> {
    try {
      const response = await httpClient.get<CourseDetailsResponse>(
        `/admin/courses/${courseId}`
      );
      console.log("Course details response:", response.data);
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || "Failed to fetch course details");
      }
      console.error("Error fetching course details:", error);
      throw error;
    }
  }

  async createCourse(
    data: Omit<Course, "id" | "currentEnrollment">
  ): Promise<Course> {
    try {
      const response = await httpClient.post<Course>("/admin/courses", data);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || "Failed to create course");
      }
      throw new Error("Failed to create course");
    }
  }

  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    try {
      const response = await httpClient.put<Course>(
        `/admin/courses/${id}`,
        data
      );
      return response.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || "Failed to update course");
      }
      throw new Error("Failed to update course");
    }
  }

  async deleteCourse(id: string): Promise<void> {
    try {
      await httpClient.delete(`/admin/courses/${id}`);
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || "Failed to delete course");
      }
      throw new Error("Failed to delete course");
    }
  }

  async getEnrollmentRequests(
    page: number,
    limit: number,
    status?: string,
    specialization?: string,
    term?: string
  ): Promise<{ data: EnrollmentRequest[]; totalPages: number }> {
    try {
      const params: Record<string, string | number> = { page, limit };
      if (status && status !== "All") params.status = status;
      if (specialization && specialization !== "All Specializations")
        params.specialization = specialization;
      if (term && term !== "All Terms") params.term = term;

      const response = await httpClient.get<EnrollmentRequestsResponse>(
        "/admin/courses/course-enrollments", 
        { params }
      );
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || "Failed to fetch enrollment requests");
      }
      throw new Error("Failed to fetch enrollment requests");
    }
  }

  async approveEnrollmentRequest(requestId: string): Promise<void> {
    try {
      await httpClient.post(
        `/admin/courses/course-enrollments/${requestId}/approve`
      );
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || "Failed to approve enrollment request");
      }
      throw new Error("Failed to approve enrollment request");
    }
  }

  async rejectEnrollmentRequest(
    requestId: string,
    reason: string
  ): Promise<void> {
    try {
      await httpClient.post(
        `/admin/courses/course-enrollments/${requestId}/reject`,
        { reason }
      );
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || "Failed to reject enrollment request");
      }
      throw new Error("Failed to reject enrollment request");
    }
  }

  async getEnrollmentRequestDetails(
    requestId: string
  ): Promise<{ courseRequest: EnrollmentRequest }> {
    try {
      const response = await httpClient.get<EnrollmentRequestDetailsResponse>(
        `/admin/courses/course-enrollments/${requestId}/details`
      );
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || "Failed to fetch enrollment request details");
      }
      console.error("Error fetching enrollment request details:", error);
      throw new Error("Failed to fetch enrollment request details");
    }
  }
}

export const courseService = new CourseService();
