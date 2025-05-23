import httpClient from '../../frameworks/api/httpClient';
import { Team, Event, TeamRequest, PlayerRequest, SportsApiResponse } from '../../domain/types/sports';

class SportsService {
  async getTeams(
    page: number,
    limit: number,
    sportType?: string,
    status?: string,
    coach?: string
  ): Promise<SportsApiResponse> {
    try {
      const response = await httpClient.get<SportsApiResponse>('/admin/sports/teams', {
        params: { page, limit, sportType, status, coach },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch teams');
    }
  }

  async getEvents(
    page: number,
    limit: number,
    sportType?: string,
    status?: string
  ): Promise<SportsApiResponse> {
    try {
      const response = await httpClient.get<SportsApiResponse>('/admin/sports/events', {
        params: { page, limit, sportType, status },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch events');
    }
  }

  async createTeam(data: Omit<Team, 'id'>): Promise<Team> {
    try {
      const response = await httpClient.post<Team>('/admin/sports/teams', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create team');
    }
  }

  async updateTeam(id: string, data: Partial<Team>): Promise<Team> {
    try {
      const response = await httpClient.put<Team>(`/admin/sports/teams/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update team');
    }
  }

  async deleteTeam(id: string): Promise<void> {
    try {
      await httpClient.delete(`/admin/sports/teams/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete team');
    }
  }

  async scheduleEvent(data: Omit<Event, 'id'>): Promise<Event> {
    try {
      const response = await httpClient.post<Event>('/admin/sports/events', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to schedule event');
    }
  }

  async getTeamRequests(
    page: number,
    limit: number,
    status?: string
  ): Promise<SportsApiResponse> {
    try {
      const response = await httpClient.get<SportsApiResponse>('/admin/sports/team-requests', {
        params: { page, limit, status },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch team requests');
    }
  }

  async approveTeamRequest(id: string): Promise<void> {
    try {
      await httpClient.post(`/admin/sports/team-requests/${id}/approve`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to approve team request');
    }
  }

  async rejectTeamRequest(id: string): Promise<void> {
    try {
      await httpClient.post(`/admin/sports/team-requests/${id}/reject`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to reject team request');
    }
  }

  async getPlayerRequests(
    page: number,
    limit: number,
    status?: string
  ): Promise<SportsApiResponse> {
    try {
      const response = await httpClient.get<SportsApiResponse>('/admin/sports/player-requests', {
        params: { page, limit, status },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch player requests');
    }
  }

  async approvePlayerRequest(id: string): Promise<void> {
    try {
      await httpClient.post(`/admin/sports/player-requests/${id}/approve`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to approve player request');
    }
  }

  async rejectPlayerRequest(id: string): Promise<void> {
    try {
      await httpClient.post(`/admin/sports/player-requests/${id}/reject`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to reject player request');
    }
  }
}

export const sportsService = new SportsService();