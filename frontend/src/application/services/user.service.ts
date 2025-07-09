// frontend/src/application/services/user.service.ts
import httpClient from '../../frameworks/api/httpClient';
import { AdmissionApiResponse, AdmissionDetails } from '../../domain/types/admission';

class UserService {
  async getAdmissions(
    page: number,
    limit: number,
    status?: string,
    program?: string,
    dateRange?: string,
    startDate?: string,
    endDate?: string
  ): Promise<AdmissionApiResponse> {
    try {
      const response = await httpClient.get<AdmissionApiResponse>('/admin/admissions', {
        params: { page, limit, status, program, dateRange, startDate, endDate },
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch admissions');
    }
  }

  async getAdmissionDetails(id: string): Promise<AdmissionDetails> {
    try {
      const response = await httpClient.get<AdmissionDetails>(`/admin/admissions/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch admission details');
    }
  }

  async approveAdmission(id: string, data: {
    programDetails: string;
    startDate: string;
    scholarshipInfo: string;
    additionalNotes: string;
  }): Promise<void> {
    try {
      await httpClient.post(`/admin/admissions/${id}/approve`, data);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to approve admission');
    }
  }

  async rejectAdmission(id: string, reason: string): Promise<void> {
    try {
      await httpClient.post(`/admin/admissions/${id}/reject`, { reason });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to reject admission');
    }
  }

  async deleteAdmission(id: string): Promise<void> {
    try {
      await httpClient.delete(`/admin/admissions/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete admission');
    }
  }

  async blockAdmission(id: string): Promise<{ message: string }> {
    try {
      const response = await httpClient.post(`/admin/admissions/${id}/block`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to block/unblock admission');
    }
  }
}

export const userService = new UserService();