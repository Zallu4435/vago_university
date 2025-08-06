import { CampusLifeResponse, Event, Sport, Club, JoinRequest } from '../../domain/types/user/campus-life';
import httpClient from '../../frameworks/api/httpClient';

class CampusLifeService {
  async getCampusLifeData(): Promise<CampusLifeResponse> {
    try {
      const response = await httpClient.get('/campus-life');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async getEvents(params?: { search?: string; status?: string; type?: string }): Promise<Event[]> {
    console.log('campusLifeService.getEvents params', params);
    try {
      const response = await httpClient.get('/campus-life/events', { params });
      if (response?.config?.url) {
        console.log('campusLifeService.getEvents final URL', response.config.url);
      }
      console.log('campusLifeService.getEvents request', '/campus-life/events', params);
      return response.data.data.events;
    } catch (error) {
      throw error;
    }
  }

  async getSports(params?: { search?: string; status?: string }): Promise<Sport[]> {
    console.log('campusLifeService.getSports params', params);
    try {
      const response = await httpClient.get('/campus-life/sports', { params });
      if (response?.config?.url) {
        console.log('campusLifeService.getSports final URL', response.config.url);
      }
      console.log('campusLifeService.getSports request', '/campus-life/sports', params);
      return response.data.data.sports;
    } catch (error) {
      throw error;
    }
  }

  async getClubs(params?: { search?: string; type?: string; status?: string }): Promise<Club[]> {
    console.log('campusLifeService.getClubs params', params);
    try {
      const response = await httpClient.get('/campus-life/clubs', { params });
      if (response?.config?.url) {
        console.log('campusLifeService.getClubs final URL', response.config.url);
      }
      console.log('campusLifeService.getClubs request', '/campus-life/clubs', params);
      return response.data.data.clubs;
    } catch (error) {
      throw error;
    }
  }

  async requestToJoinClub(clubId: string, request: JoinRequest): Promise<void> {
    try {
      await httpClient.post(`/campus-life/clubs/${clubId}/join`, request);
    } catch (error) {
      throw error;
    }
  }

  async requestToJoinSport(sportId: string, request: JoinRequest): Promise<void> {
    try {
      await httpClient.post(`/campus-life/sports/${sportId}/join`, request);
    } catch (error) {
      throw error;
    }
  }

  async requestToJoinEvent(eventId: string, request: JoinRequest): Promise<void> {
    try {
      await httpClient.post(`/campus-life/events/${eventId}/join`, request);
    } catch (error) {
      throw error;
    }
  }
}

export const campusLifeService = new CampusLifeService();