import { ISessionRepository } from '../../../application/session/repositories/ISessionRepository';
import { VideoSession } from '../../../domain/session/entities/VideoSession';
import { VideoSessionModel } from '../../database/mongoose/models/session.model';
import { VideoSessionStatus } from '../../../domain/session/enums/VideoSessionStatus';

export class SessionRepository implements ISessionRepository {
  async create(session: VideoSession): Promise<VideoSession> {
    const doc = await VideoSessionModel.create({
      title: session.title,
      hostId: session.hostId,
      participants: session.participants,
      startTime: session.startTime,
      endTime: session.endTime,
      status: session.status,
      description: session.description,
      instructor: session.instructor,
      course: session.course,
      duration: session.duration,
      maxAttendees: session.maxAttendees,
      tags: session.tags,
      difficulty: session.difficulty,
      isLive: session.isLive,
      hasRecording: session.hasRecording,
      recordingUrl: session.recordingUrl,
      attendees: session.attendees,
      attendeeList: session.attendeeList,
      joinUrl: session.joinUrl,
    });
    return doc.toObject() as VideoSession;
  }

  async join(sessionId: string, participantId: string): Promise<VideoSession> {
    const session = await VideoSessionModel.findById(sessionId);
    if (!session) throw new Error('Session not found');
    if (!session.participants.includes(participantId)) {
      session.participants.push(participantId);
      await session.save();
    }
    return session.toObject() as VideoSession;
  }

  async getById(sessionId: string): Promise<VideoSession | null> {
    const session = await VideoSessionModel.findById(sessionId);
    return session ? (session.toObject() as VideoSession) : null;
  }

  async update(sessionId: string, data: Partial<VideoSession>): Promise<VideoSession | null> {
    const session = await VideoSessionModel.findByIdAndUpdate(sessionId, data, { new: true });
    if (!session) {
      console.log('Session not found for update:', sessionId);
    }
    return session ? (session.toObject() as VideoSession) : null;
  }

  async delete(sessionId: string): Promise<void> {
    await VideoSessionModel.findByIdAndDelete(sessionId);
  }

  async getAll(): Promise<VideoSession[]> {
    const sessions = await VideoSessionModel.find();
    return sessions.map(doc => doc.toObject() as VideoSession);
  }
} 