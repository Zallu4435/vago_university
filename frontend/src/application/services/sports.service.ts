import { SportsApiResponse, Team, TeamApiResponseSingle, PlayerRequestApiResponseSingle, PlayerRequest } from '../../domain/types/management/sportmanagement';
import httpClient from '../../frameworks/api/httpClient';
import { isAxiosErrorWithApiError } from '../../shared/types/apiError';

class SportsService {
  async getTeams(
    page: number,
    limit: number,
    sportType?: string,
    status?: string,
    coach?: string,
    dateRange?: string,
    search?: string
  ): Promise<SportsApiResponse<Team>['data']> {
    try {
      const params: Record<string, string | number> = { page, limit };
      if (sportType && sportType !== 'All') params.sportType = sportType;
      if (status && status !== 'All') params.status = status;
      if (coach && coach !== 'All') params.coach = coach;
      if (dateRange && dateRange !== 'All') {
        const [startDate, endDate] = dateRange.split(',');
        params.startDate = startDate;
        params.endDate = endDate;
      }
      if (search && search.trim() !== '') params.search = search;

      const response = await httpClient.get<SportsApiResponse<Team>>('/admin/sports', { params });
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        console.error('getTeams error:', error);
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch teams');
      }
      throw new Error('Failed to fetch teams');
    }
  }

  async getPlayerRequests(
    page: number,
    limit: number,
    sportType?: string,
    status?: string,
    dateRange?: string,
    search?: string
  ): Promise<SportsApiResponse<PlayerRequest>['data']> {
    try {
      const params: Record<string, string | number> = { page, limit };
      if (sportType && sportType !== 'All') params.sportType = sportType;
      if (status && status !== 'All') params.status = status;
      if (dateRange && dateRange !== 'All') {
        const [startDate, endDate] = dateRange.split(',');
        params.startDate = startDate;
        params.endDate = endDate;
      }
      if (search && search.trim() !== '') params.search = search;

      const response = await httpClient.get<SportsApiResponse<PlayerRequest>>('/admin/sport-requests', { params });
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        console.error('getPlayerRequests error:', error);
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch player requests');
      }
      throw new Error('Failed to fetch player requests');
    }
  }

  async createTeam(data: Omit<Team, 'id'>): Promise<Team> {
    try {
      const response = await httpClient.post<Team>('/admin/sports', data);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to create team');
      }
      throw new Error('Failed to create team');
    }
  }

  async updateTeam(id: string, data: Partial<Team>): Promise<Team> {
    try {
      const response = await httpClient.put<Team>(`/admin/sports/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to update team');
      }
      throw new Error('Failed to update team');
    }
  }

  async deleteTeam(id: string): Promise<void> {
    try {
      await httpClient.delete(`/admin/sports/${id}`);
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to delete team');
      }
      throw new Error('Failed to delete team');
    }
  }

  async approvePlayerRequest(id: string): Promise<void> {
    try {
      await httpClient.post(`/admin/sport-requests/${id}/approve`);
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to approve player request');
      }
      throw new Error('Failed to approve player request');
    }
  }

  async rejectPlayerRequest(id: string): Promise<void> {
    try {
      await httpClient.post(`/admin/sport-requests/${id}/reject`);
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to reject player request');
      }
      throw new Error('Failed to reject player request');
    }
  }

  async getTeamDetails(id: string): Promise<TeamApiResponseSingle['data']> {
    try {
      const response = await httpClient.get<TeamApiResponseSingle>(`/admin/sports/${id}`);
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        console.error('Error fetching team details:', error);
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch team details');
      }
      throw new Error('Failed to fetch team details');
    }
  }

  async getRequestDetails(id: string): Promise<PlayerRequestApiResponseSingle['data']> {
    try {
      const response = await httpClient.get<PlayerRequestApiResponseSingle>(`/admin/sport-requests/${id}`);
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        console.error('Error fetching request details:', error);
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch request details');
      }
      throw new Error('Failed to fetch request details');
    }
  }
}

export const sportsService = new SportsService();