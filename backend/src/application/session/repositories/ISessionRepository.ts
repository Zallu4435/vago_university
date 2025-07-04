import { VideoSession } from '../../../domain/session/entities/VideoSession';

export interface ISessionRepository {
  create(session: VideoSession): Promise<VideoSession>;
  join(sessionId: string, participantId: string): Promise<VideoSession>;
  getById(sessionId: string): Promise<VideoSession | null>;
  update(sessionId: string, data: Partial<VideoSession>): Promise<VideoSession | null>;
  delete(sessionId: string): Promise<void>;
  getAll(): Promise<VideoSession[]>;
}
