import httpClient from '../../frameworks/api/httpClient';
import { isAxiosErrorWithApiError } from '../../shared/types/apiError';

export interface Attendee {
  id: string;
  name: string;
}

export interface CreateVideoSessionPayload {
  title: string;
  hostId?: string; // Optional since it will be set automatically by the backend
  startTime: string; // ISO string
  description?: string;
  instructor?: string;
  course?: string;
  duration?: number;
  maxAttendees?: number;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  isLive?: boolean;
  hasRecording?: boolean;
  recordingUrl?: string;
  attendees?: number;
  attendeeList?: Attendee[];
}

export interface UpdateVideoSessionPayload {
  id: string;
  data: Partial<CreateVideoSessionPayload & { endTime?: string; status?: string }>;
}

class SessionService {
  async createVideoSession(payload: CreateVideoSessionPayload) {
    try {
      const response = await httpClient.post('/faculty/sessions/video-sessions', payload);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to create video session');
      }
      throw new Error('Failed to create video session');
    }
  }

  async getSessions(params = {}) {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '' && value !== 'all')
    ) as Record<string, string>;
    const queryString = Object.keys(filteredParams).length
      ? '?' + new URLSearchParams(filteredParams).toString()
      : '';
    try {
      const response = await httpClient.get(`/faculty/sessions/video-sessions${queryString}`);
      return response.data.data.map((s: any) => ({ ...s, id: s._id }));
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to get sessions');
      }
      throw new Error('Failed to get sessions');
    }
  }

  async getSessionById(id: string) {
    try {
      const response = await httpClient.get(`/faculty/sessions/video-sessions/${id}`);
      const s = response.data.data;
      return { ...s, id: s._id };
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to get session by ID');
      }
      throw new Error('Failed to get session by ID');
    }
  }

  async updateSession(id: string, data: any) {
    console.log('Updating session with id:', id);
    console.log('Update data:', data);
    try {
      const response = await httpClient.put(`/faculty/sessions/video-sessions/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to update session');
      }
      throw new Error('Failed to update session');
    }
  }

  async deleteSession(id: string) {
    try {
      const response = await httpClient.delete(`/faculty/sessions/video-sessions/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to delete session');
      }
      throw new Error('Failed to delete session');
    }
  }

  async updateSessionStatus(id: string, status: string) {
    try {
      const response = await httpClient.put(`/faculty/sessions/video-sessions/${id}/status`, { status });
      return response.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to update session status');
      }
      throw new Error('Failed to update session status');
    }
  }

  async attendanceJoin(sessionId: string) {
    try {
      return httpClient.post(`/faculty/sessions/video-sessions/${sessionId}/attendance/join`);
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to join attendance');
      }
      throw new Error('Failed to join attendance');
    }
  }

  async attendanceLeave(sessionId: string) {
    try {
      return httpClient.post(`/faculty/sessions/video-sessions/${sessionId}/attendance/leave`);
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to leave attendance');
      }
      throw new Error('Failed to leave attendance');
    }
  }

  async getSessionAttendance(sessionId: string, filters: any = {}) {
    const filteredParams = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => 
        value !== undefined && value !== null && value !== '' && value !== 'all'
      )
    ) as Record<string, string>;
    
    if (filteredParams.startDate) {
      filteredParams.startDate = new Date(filteredParams.startDate).toISOString();
    }
    if (filteredParams.endDate) {
      filteredParams.endDate = new Date(filteredParams.endDate).toISOString();
    }
    
    const params = new URLSearchParams(filteredParams).toString();
    try {
      const response = await httpClient.get(`/faculty/sessions/video-sessions/${sessionId}/attendance${params ? '?' + params : ''}`);
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to get session attendance');
      }
      throw new Error('Failed to get session attendance');
    }
  }

  async updateAttendanceStatus(sessionId: string, userId: string, status: string, name: string) {
    try {
      const response = await httpClient.put(`/faculty/sessions/video-sessions/${sessionId}/attendance/${userId}/status`, { status, name });
      return response.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to update attendance status');
      }
      throw new Error('Failed to update attendance status');
    }
  }
}

export const sessionService = new SessionService(); 