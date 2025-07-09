import httpClient from "../../frameworks/api/httpClient";
import {
  Course,
  CourseApiResponse,
  CourseDetails,
  EnrollmentRequest,
} from "../../domain/types/course";

class CourseService {
  async getCourses(
    page: number,
    limit: number,
    specialization?: string,
    faculty?: string,
    term?: string
  ): Promise<CourseApiResponse> {
    try {
      const response = await httpClient.get<CourseApiResponse>(
        "/admin/courses",
        {
          params: { page, limit, specialization, faculty, term },
        }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Failed to fetch courses");
    }
  }

  async getCourseDetails(courseId: string): Promise<CourseDetails> {
    try {
      const response = await httpClient.get<CourseDetails>(
        `/admin/courses/${courseId}`
      );
      console.log("Course details response:", response.data);
      return response.data.data;
    } catch (error) {
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
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Failed to create course");
    }
  }

  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    try {
      const response = await httpClient.put<Course>(
        `/admin/courses/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Failed to update course");
    }
  }

  async deleteCourse(id: string): Promise<void> {
    try {
      await httpClient.delete(`/admin/courses/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Failed to delete course");
    }
  }

  async getEnrollmentRequests(
    page: number,
    limit: number,
    status?: string,
    specialization?: string,
    term?: string
  ): Promise<{ requests: EnrollmentRequest[]; totalPages: number }> {
    try {
      const params: Record<string, string | number> = { page, limit };
      if (status && status !== "All") params.status = status;
      if (specialization && specialization !== "All Specializations")
        params.specialization = specialization;
      if (term && term !== "All Terms") params.term = term;

      const response = await httpClient.get<{
        requests: EnrollmentRequest[];
        totalPages: number;
      }>("/admin/courses/course-enrollments", { params });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch enrollment requests"
      );
    }
  }

  async approveEnrollmentRequest(requestId: string): Promise<void> {
    try {
      await httpClient.post(
        `/admin/courses/course-enrollments/${requestId}/approve`
      );
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to approve enrollment request"
      );
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
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to reject enrollment request"
      );
    }
  }

  async getEnrollmentRequestDetails(
    requestId: string
  ): Promise<EnrollmentRequest> {
    try {
      const response = await httpClient.get<EnrollmentRequest>(
        `/admin/courses/course-enrollments/${requestId}/details`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching enrollment request details:", error);
      throw new Error(
        error.response?.data?.error ||
          "Failed to fetch enrollment request details"
      );
    }
  }
}

export const courseService = new CourseService();
