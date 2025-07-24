import httpClient from '../../frameworks/api/httpClient';

export interface UniversitySession {
  id?: string;
  title: string;
  instructor: string;
  course: string;
  date: string;
  time: string;
  duration: number;
  status: string;
  hasRecording: boolean;
  attendees: number;
  maxAttendees: number;
  description: string;
  tags: string[];
  difficulty: string;
  isLive: boolean;
  connectionQuality?: string | null;
}

class UniversitySessionService {
  async getSessions(params = {}) {
    const response = await httpClient.get('/faculty/sessions/video-sessions', { params });
    return response.data.data;
  }

  async joinSession(sessionId: string, userId: string) {
    const response = await httpClient.post(`/faculty/sessions/${sessionId}/join`, { userId });
    return response.data;
  }
}

export const universitySessionService = new UniversitySessionService(); 