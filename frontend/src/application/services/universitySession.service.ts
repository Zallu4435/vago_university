import httpClient from '../../frameworks/api/httpClient';

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