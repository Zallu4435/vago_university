// src/application/services/faculty.service.ts
import httpClient from '../../frameworks/api/httpClient';
import { Faculty, FacultyApprovalData } from '../../domain/types/faculty.types';

interface FacultyApiResponse {
  faculty: Faculty[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

class FacultyService {
  async getFaculty(
    page: number,
    limit: number,
    status?: string,
    department?: string,
    dateRange?: string,
    startDate?: string,
    endDate?: string
  ): Promise<FacultyApiResponse> {
    try {
      const params: Record<string, string | number> = {
        page,
        limit
      };

      // Only add filter parameters if they have values
      if (status) params.status = status;
      if (department) params.department = department;
      if (dateRange) params.dateRange = dateRange;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await httpClient.get<FacultyApiResponse>('/admin/faculty', {
        params
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch faculty');
    }
  }

  async getFacultyDetails(id: string): Promise<Faculty> {
    try {
      const response = await httpClient.get<Faculty>(`/admin/faculty/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch faculty details');
    }
  }

  async approveFaculty(
    id: string,
    approvalData: FacultyApprovalData
  ): Promise<{ message: string; faculty: Faculty }> {
    try {
      const response = await httpClient.post<{ message: string; faculty: Faculty }>(
        `/admin/faculty/${id}/approve`,
        approvalData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to approve faculty request');
    }
  }

  async rejectFaculty(
    id: string,
    reason: string
  ): Promise<{ message: string }> {
    try {
      const response = await httpClient.post<{ message: string }>(
        `/admin/faculty/${id}/reject`,
        { reason }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to reject faculty request');
    }
  }

  async deleteFaculty(id: string): Promise<{ message: string }> {
    try {
      const response = await httpClient.delete<{ message: string }>(`/faculty/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete faculty request');
    }
  }

  async updateFacultyStatus(
    id: string,
    status: string
  ): Promise<{ message: string; faculty: Faculty }> {
    try {
      const response = await httpClient.patch<{ message: string; faculty: Faculty }>(
        `/admin/faculty/${id}/status`,
        { status }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update faculty status');
    }
  }
}

export const facultyService = new FacultyService();