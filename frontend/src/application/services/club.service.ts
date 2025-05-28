// src/application/services/club.service.ts
import httpClient from '../../frameworks/api/httpClient';
import { Club, ClubRequest, MemberRequest, ClubApiResponse } from '../../domain/types/club';

class ClubService {
  async getClubs(
    page: number,
    limit: number,
    category?: string,
    status?: string
  ): Promise<ClubApiResponse> {
    try {
      const response = await httpClient.get<ClubApiResponse>('/admin/clubs', {
        params: { page, limit, category, status },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch clubs');
    }
  }

  async getClubDetails(id: string): Promise<Club> {
    try {
      const response = await httpClient.get<Club>(`/admin/clubs/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch club details');
    }
  }

  async createClub(data: Omit<Club, 'id' | 'members'>): Promise<Club> {
    try {
      const response = await httpClient.post<Club>('/admin/clubs', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create club');
    }
  }

  async updateClub(id: string, data: Partial<Club>): Promise<Club> {
    try {
      const response = await httpClient.put<Club>(`/admin/clubs/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update club');
    }
  }

  async deleteClub(id: string): Promise<void> {
    try {
      await httpClient.delete(`/admin/clubs/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete club');
    }
  }

  async getClubRequests(
    page: number,
    limit: number,
    status?: string
  ): Promise<ClubApiResponse> {
    try {
      const response = await httpClient.get('/admin/clubs/club-requests', {
        params: { page, limit, status },
      });
      console.log(response.data, 'response.data');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch club requests');
    }
  }

  async approveClubRequest(id: string): Promise<void> {
    try {
      await httpClient.post(`/admin/clubs/club-requests/${id}/approve`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to approve club request');
    }
  }

  async rejectClubRequest(id: string): Promise<void> {
    try {
      await httpClient.post(`/admin/clubs/club-requests/${id}/reject`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to reject club request');
    }
  }

  async getMemberRequests(
    page: number,
    limit: number,
    status?: string
  ): Promise<ClubApiResponse> {
    try {
      const response = await httpClient.get<ClubApiResponse>('/admin/clubs/member-requests', {
        params: { page, limit, status },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch member requests');
    }
  }

  async approveMemberRequest(id: string): Promise<void> {
    try {
      await httpClient.post(`/admin/clubs/member-requests/${id}/approve`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to approve member request');
    }
  }

  async rejectMemberRequest(id: string): Promise<void> {
    try {
      await httpClient.post(`/admin/clubs/member-requests/${id}/reject`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to reject member request');
    }
  }
}

export const clubService = new ClubService();