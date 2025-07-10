// src/application/services/campus-life.service.ts
import { CampusLifeResponse, Event, Sport, Club, JoinRequest } from '../../domain/types/user/campus-life';
import httpClient from '../../frameworks/api/httpClient';

class CampusLifeService {
  async getCampusLifeData(): Promise<CampusLifeResponse> {
    try {
      const response = await httpClient.get('/campus-life');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getEvents(): Promise<Event[]> {
    try {
      const response = await httpClient.get('/campus-life/events');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async getSports(): Promise<Sport[]> {
    try {
      const response = await httpClient.get('/campus-life/sports');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async getClubs(): Promise<Club[]> {
    try {
      const response = await httpClient.get('/campus-life/clubs');
      return response.data;
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