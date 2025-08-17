import httpClient from '../../frameworks/api/httpClient';

export interface UniversitySession {
  id: string;
  title: string;
  status: string;
  description?: string;
  instructor?: string;
  course?: string;
  duration?: number;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  hasRecording?: boolean;
  startTime: string;
  joinUrl?: string;
  isLive?: boolean;
  isEnrolled?: boolean;
  userAttendanceStatus?: string;
}

class UniversitySessionService {
  async getSessions(params = {}) {
    const response = await httpClient.get('/faculty/sessions/university/sessions', { params });
    return response.data.data;
  }

  async joinSession(sessionId: string, userId: string) {
    const response = await httpClient.post(`/faculty/sessions/${sessionId}/join`, { userId });
    return response.data;
  }
}

export const universitySessionService = new UniversitySessionService(); 