// src/application/services/club.service.ts
import httpClient from '../../frameworks/api/httpClient';
import { Club, ClubRequest, ClubApiResponse, ClubResponse, ClubRequestResponse } from '../../domain/types/club';
import { isAxiosErrorWithApiError } from '../../shared/types/apiError';

class ClubService {
  async getClubs(
    page: number,
    limit: number,
    category?: string,
    status?: string,
    dateRange?: string,
    search?: string
  ): Promise<ClubApiResponse['data']> {
    try {
      const response = await httpClient.get<ClubApiResponse>('/admin/clubs', {
        params: { page, limit, category, status, dateRange, search },
      });
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch clubs');
      }
      throw new Error('Failed to fetch clubs');
    }
  }

  async getClubDetails(id: string): Promise<Club> {
    try {
      const response = await httpClient.get<ClubResponse>(`/admin/clubs/${id}`);
      console.log(response.data, "[md[lsmsl[ms[lms[ldm")
      return response.data.data.club;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch club details');
      }
      throw new Error('Failed to fetch club details');
    }
  }

  async createClub(data: Omit<Club, 'id' | 'members'>): Promise<Club> {
    try {
      const response = await httpClient.post<Club>('/admin/clubs', data);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to create club');
      }
      throw new Error('Failed to create club');
    }
  }

  async updateClub(id: string, data: Partial<Club>): Promise<Club> {
    try {
      const response = await httpClient.put<Club>(`/admin/clubs/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to update club');
      }
      throw new Error('Failed to update club');
    }
  }

  async deleteClub(id: string): Promise<void> {
    try {
      await httpClient.delete(`/admin/clubs/${id}`);
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to delete club');
      }
      throw new Error('Failed to delete club');
    }
  }

  async getClubRequests(
    page: number,
    limit: number,
    category?: string,
    status?: string,
    dateRange?: string,
    search?: string
  ): Promise<ClubApiResponse['data']> {
    try {
      const response = await httpClient.get<ClubApiResponse>('/admin/club-requests', {
        params: { page, limit, category, status, dateRange, search },
      });
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch club requests');
      }
      throw new Error('Failed to fetch club requests');
    }
  }

  async approveClubRequest(id: string): Promise<void> {
    try {
      await httpClient.post(`/admin/club-requests/${id}/approve`);
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to approve club request');
      }
      throw new Error('Failed to approve club request');
    }
  }

  async rejectClubRequest(id: string): Promise<void> {
    try {
      await httpClient.post(`/admin/club-requests/${id}/reject`);
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to reject club request');
      }
      throw new Error('Failed to reject club request');
    }
  }

  async getClubRequestDetails(id: string): Promise<ClubRequest> {
    try {
      const response = await httpClient.get<ClubRequestResponse>(`/admin/club-requests/${id}`);
      return response.data.data.clubRequest;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch event request details');
      }
      throw new Error('Failed to fetch event request details');
    }
  }
}

export const clubService = new ClubService();