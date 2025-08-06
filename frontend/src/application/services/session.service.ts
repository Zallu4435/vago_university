import httpClient from '../../frameworks/api/httpClient';

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
    const response = await httpClient.post('/faculty/sessions/video-sessions', payload);
    return response.data;
  }

  async getSessions(params = {}) {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '' && value !== 'all')
    ) as Record<string, string>;
    const queryString = Object.keys(filteredParams).length
      ? '?' + new URLSearchParams(filteredParams).toString()
      : '';
    const response = await httpClient.get(`/faculty/sessions/video-sessions${queryString}`);
    return response.data.data.map((s: any) => ({ ...s, id: s._id }));
  }

  async getSessionById(id: string) {
    const response = await httpClient.get(`/faculty/sessions/video-sessions/${id}`);
    const s = response.data.data;
    return { ...s, id: s._id };
  }

  async updateSession(id: string, data: any) {
    console.log('Updating session with id:', id);
    console.log('Update data:', data);
    const response = await httpClient.put(`/faculty/sessions/video-sessions/${id}`, data);
    return response.data;
  }

  async deleteSession(id: string) {
    const response = await httpClient.delete(`/faculty/sessions/video-sessions/${id}`);
    return response.data;
  }

  async updateSessionStatus(id: string, status: string) {
    const response = await httpClient.put(`/faculty/sessions/video-sessions/${id}/status`, { status });
    return response.data;
  }

  async attendanceJoin(sessionId: string) {
    return httpClient.post(`/faculty/sessions/video-sessions/${sessionId}/attendance/join`);
  }

  async attendanceLeave(sessionId: string) {
    return httpClient.post(`/faculty/sessions/video-sessions/${sessionId}/attendance/leave`);
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
    const response = await httpClient.get(`/faculty/sessions/video-sessions/${sessionId}/attendance${params ? '?' + params : ''}`);
    return response.data.data;
  }

  async updateAttendanceStatus(sessionId: string, userId: string, status: string, name: string) {
    const response = await httpClient.put(`/faculty/sessions/video-sessions/${sessionId}/attendance/${userId}/status`, { status, name });
    return response.data;
  }
}

export const sessionService = new SessionService(); 