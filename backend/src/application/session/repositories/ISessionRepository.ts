import { VideoSession } from '../../../domain/session/entities/VideoSession';

export interface ISessionRepository {
  create(session: VideoSession): Promise<VideoSession>;
  join(sessionId: string, participantId: string): Promise<VideoSession>;
  getById(sessionId: string): Promise<VideoSession | null>;
  update(sessionId: string, data: Partial<VideoSession>): Promise<VideoSession | null>;
  delete(sessionId: string): Promise<void>;
  getAll(params?: { search?: string; status?: string; instructor?: string }): Promise<VideoSession[]>;
  getSessionAttendance(sessionId: string, filters?: any): Promise<any[]>;
  updateAttendanceStatus(sessionId: string, userId: string, status: string, name: string): Promise<void>;
  recordAttendanceJoin(sessionId: string, userId: string): Promise<void>;
  recordAttendanceLeave(sessionId: string, userId: string): Promise<void>;
}
