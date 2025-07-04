import httpClient from '../../frameworks/api/httpClient';

export interface Attendee {
  id: string;
  name: string;
}

export interface CreateVideoSessionPayload {
  title: string;
  hostId: string;
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

  async getSessions() {
    const response = await httpClient.get('/faculty/sessions/video-sessions');
    return response.data.data;
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
}

export const sessionService = new SessionService(); 