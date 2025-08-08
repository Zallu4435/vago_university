import { SportsApiResponse, Team, TeamApiResponseSingle, PlayerRequestApiResponseSingle } from '../../domain/types/management/sportmanagement';
import httpClient from '../../frameworks/api/httpClient';

class SportsService {
  async getTeams(
    page: number,
    limit: number,
    sportType?: string,
    status?: string,
    coach?: string,
    dateRange?: string,
    search?: string
  ): Promise<SportsApiResponse['data']> {
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

      const response = await httpClient.get<SportsApiResponse>('/admin/sports', { params });
      return response.data.data;
    } catch (error: any) {
      console.error('getTeams error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch teams');
    }
  }

  async getPlayerRequests(
    page: number,
    limit: number,
    sportType?: string,
    status?: string,
    dateRange?: string,
    search?: string
  ): Promise<SportsApiResponse['data']> {
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

      const response = await httpClient.get<SportsApiResponse>('/admin/sport-requests', { params });
      console.log(response.data, "hushuoshduohsu")
      return response.data.data;
    } catch (error: any) {
      console.error('getPlayerRequests error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch player requests');
    }
  }

  async createTeam(data: Omit<Team, 'id'>): Promise<Team> {
    try {
      const response = await httpClient.post<Team>('/admin/sports', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create team');
    }
  }

  async updateTeam(id: string, data: Partial<Team>): Promise<Team> {
    try {
      const response = await httpClient.put<Team>(`/admin/sports/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update team');
    }
  }

  async deleteTeam(id: string): Promise<void> {
    try {
      await httpClient.delete(`/admin/sports/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete team');
    }
  }

  async approvePlayerRequest(id: string): Promise<void> {
    try {
      await httpClient.post(`/admin/sport-requests/${id}/approve`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to approve player request');
    }
  }

  async rejectPlayerRequest(id: string): Promise<void> {
    try {
      await httpClient.post(`/admin/sport-requests/${id}/reject`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to reject player request');
    }
  }

  async getTeamDetails(id: string): Promise<TeamApiResponseSingle['data']> {
    try {
      const response = await httpClient.get<TeamApiResponseSingle>(`/admin/sports/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching team details:', error);
      throw error;
    }
  }

  async getRequestDetails(id: string): Promise<PlayerRequestApiResponseSingle['data']> {
    try {
      const response = await httpClient.get<PlayerRequestApiResponseSingle>(`/admin/sport-requests/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching request details:', error);
      throw error;
    }
  }
}

export const sportsService = new SportsService();