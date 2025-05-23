// src/application/services/event.service.ts
import httpClient from '../../frameworks/api/httpClient';
import { Event, EventRequest, Participant, EventApiResponse } from '../../domain/types/event';

class EventService {
  async getEvents(
    page: number,
    limit: number,
    type?: string,
    status?: string,
    organizer?: string
  ): Promise<EventApiResponse> {
    try {
      const response = await httpClient.get<EventApiResponse>('/admin/events', {
        params: { page, limit, type, status, organizer },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch events');
    }
  }

  async getEventDetails(id: string): Promise<Event> {
    try {
      const response = await httpClient.get<Event>(`/admin/events/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch event details');
    }
  }

  async createEvent(data: Omit<Event, 'id' | 'participants'>): Promise<Event> {
    try {
      const response = await httpClient.post<Event>('/admin/events', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create event');
    }
  }

  async updateEvent(id: string, data: Partial<Event>): Promise<Event> {
    try {
      const response = await httpClient.put<Event>(`/admin/events/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update event');
    }
  }

  async deleteEvent(id: string): Promise<void> {
    try {
      await httpClient.delete(`/admin/events/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete event');
    }
  }

  async getEventRequests(
    page: number,
    limit: number,
    type?: string,
    status?: string,
    organizer?: string
  ): Promise<EventApiResponse> {
    try {
      const response = await httpClient.get<EventApiResponse>('/admin/events/requests', {
        params: { page, limit, type, status, organizer },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch event requests');
    }
  }

  async approveEventRequest(id: string): Promise<void> {
    try {
      await httpClient.post(`/admin/events/requests/${id}/approve`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to approve event request');
    }
  }

  async rejectEventRequest(id: string): Promise<void> {
    try {
      await httpClient.post(`/admin/events/requests/${id}/reject`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to reject event request');
    }
  }

  async getParticipants(
    page: number,
    limit: number,
    status?: string
  ): Promise<EventApiResponse> {
    try {
      const response = await httpClient.get<EventApiResponse>('/admin/events/participants', {
        params: { page, limit, status },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch participants');
    }
  }

  async approveParticipant(id: string): Promise<void> {
    try {
      await httpClient.post(`/admin/events/participants/${id}/approve`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to approve participant');
    }
  }

  async rejectParticipant(id: string): Promise<void> {
    try {
      await httpClient.post(`/admin/events/participants/${id}/reject`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to reject participant');
    }
  }

  async removeParticipant(id: string): Promise<void> {
    try {
      await httpClient.delete(`/admin/events/participants/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to remove participant');
    }
  }
}

export const eventService = new EventService();