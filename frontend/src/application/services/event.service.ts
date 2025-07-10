// src/application/services/event.service.ts
import { EventApiResponse, EventRequest } from '../../domain/types/management/eventmanagement';
import httpClient from '../../frameworks/api/httpClient';

class EventService {
  async getEvents(
    page: number,
    limit: number,
    type?: string,
    status?: string,
    dateRange?: string
  ): Promise<EventApiResponse> {
    try {
      const params: Record<string, string | number> = {
        page,
        limit
      };

      if (type && type !== 'All') {
        params.type = type;
      }
      if (status && status !== 'All') {
        params.status = status;
      }
      if (dateRange && dateRange !== 'All') {
        const [startDate, endDate] = dateRange.split(',');
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const response = await httpClient.get<EventApiResponse>('/admin/events', {
        params
      });
      return response.data.data;
    } catch (error: any) {
      console.error('getEvents error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch events');
    }
  }

  async getEventDetails(id: string): Promise<Event> {
    try {
      const response = await httpClient.get<Event>(`/admin/events/${id}`);
      return response.data.data.event;
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
    dateRange?: string
  ): Promise<EventApiResponse> {
    try {
      const params: Record<string, string | number> = {
        page,
        limit
      };

      if (type && type !== 'All') {
        params.type = type;
      }
      if (status && status !== 'All') {
        params.status = status;
      }
      if (dateRange && dateRange !== 'All') {
        const [startDate, endDate] = dateRange.split(',');
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const response = await httpClient.get<EventApiResponse>('/admin/event-requests', {
        params
      });
      return response.data.data;
    } catch (error: any) {
      console.error('getEventRequests error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch event requests');
    }
  }

  async approveEventRequest(id: string): Promise<void> {
    try {
      await httpClient.post(`/admin/event-requests/${id}/approve`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to approve event request');
    }
  }

  async rejectEventRequest(id: string): Promise<void> {
    try {
      await httpClient.post(`/admin/event-requests/${id}/reject`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to reject event request');
    }
  }


  async getEventRequestDetails(id: string): Promise<EventRequest> {
    try {
      const response = await httpClient.get<EventRequest>(`/admin/event-requests/${id}`);
      return response.data.data.eventRequest;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch event request details');
    }
  }
}

export const eventService = new EventService();