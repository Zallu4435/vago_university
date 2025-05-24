// src/application/services/campus-life.service.ts
import { CampusLifeResponse, Event, Sport, Club } from '../../domain/types/campus-life';
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
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getSports(): Promise<Sport[]> {
    try {
      const response = await httpClient.get('/campus-life/sports');
      return response.data;
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
}

export const campusLifeService = new CampusLifeService();