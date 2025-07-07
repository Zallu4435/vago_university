import { ISessionRepository } from '../../../application/session/repositories/ISessionRepository';
import { VideoSession } from '../../../domain/session/entities/VideoSession';
import { VideoSessionModel } from '../../database/mongoose/models/session.model';
import { User } from '../../database/mongoose/models/user.model';

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
    const sessions = await VideoSessionModel.find().sort({ createdAt: -1 });
    return sessions.map(doc => doc.toObject() as VideoSession);
  }

  async getSessionAttendance(sessionId: string, filters: any = {}): Promise<any[]> {
    const session = await VideoSessionModel.findById(sessionId);
    if (!session) throw new Error('Session not found');
    let attendance = session.attendance || [];

    if (filters.search && filters.search.trim() !== '') {
      const search = filters.search.toLowerCase();
      const userIds = attendance.map((a: any) => a.userId);
      const users = await User.find({ _id: { $in: userIds } }).lean();
      const userMap = new Map(users.map((u: any) => [u._id.toString(), u]));
      attendance = attendance.filter((a: any) => {
        const user = userMap.get(a.userId);
        return user && (
          (user.firstName && user.firstName.toLowerCase().includes(search)) ||
          (user.lastName && user.lastName.toLowerCase().includes(search)) ||
          (user.email && user.email.toLowerCase().includes(search))
        );
      });
    }

    if (filters.decision && filters.decision.trim() !== '' && filters.decision !== 'all') {
      const decision = filters.decision.toLowerCase();

      const beforeCount = attendance.length;
      attendance = attendance.filter((a: any) => {

        if (!a.status) {
          const result = decision === 'pending';
          return result;
        }

        const statusLower = a.status.toLowerCase();

        let result = statusLower === decision;
        if (decision === 'approved' && (statusLower === 'approve' || statusLower === 'approved')) {
          result = true;
        } else if (decision === 'approve' && (statusLower === 'approve' || statusLower === 'approved')) {
          result = true;
        } else if (decision === 'denied' && (statusLower === 'deny' || statusLower === 'denied')) {
          result = true;
        } else if (decision === 'deny' && (statusLower === 'deny' || statusLower === 'denied')) {
          result = true;
        } else if (decision === 'pending' && (statusLower === 'pending' || !a.status)) {
          result = true;
        }

        return result;
      });
    }

    if (filters.attendanceLevel && filters.attendanceLevel.trim() !== '' && filters.attendanceLevel !== 'all') {
      const level = filters.attendanceLevel.toLowerCase();
      attendance = attendance.filter((a: any) => {
        let totalMinutes = 0;
        if (Array.isArray(a.intervals)) {
          totalMinutes = a.intervals.reduce((sum: number, interval: any) => {
            if (interval.joinedAt && interval.leftAt) {
              const joined = new Date(interval.joinedAt).getTime();
              const left = new Date(interval.leftAt).getTime();
              if (!isNaN(joined) && !isNaN(left) && left > joined) {
                return sum + (left - joined) / 60000; // ms to minutes
              }
            }
            return sum;
          }, 0);
        }
        let calculatedLevel = 'low';
        if (totalMinutes >= 60) calculatedLevel = 'high';
        else if (totalMinutes >= 30) calculatedLevel = 'medium';

        return calculatedLevel === level;
      });
    }

    const userIds = attendance.map((a: any) => a.userId);
    const users = await User.find({ _id: { $in: userIds } }).lean();
    const userMap = new Map(users.map((u: any) => [u._id.toString(), u]));
    const result = attendance
      .filter((a: any) => userMap.has(a.userId))
      .map((a: any) => {
        const user = userMap.get(a.userId);
        return {
          id: a.userId,
          username: user ? (user.firstName + (user.lastName ? ' ' + user.lastName : '')) : '',
          email: user ? user.email : '',
          intervals: a.intervals || [],
          status: a.status || null
        };
      });
    return result;
  }

  async updateAttendanceStatus(sessionId: string, userId: string, status: string, name: string): Promise<void> {
    const session = await VideoSessionModel.findById(sessionId);
    if (!session) throw new Error('Session not found');

    const attendanceIndex = session.attendance.findIndex((a: any) => a.userId === userId);
    if (attendanceIndex === -1) throw new Error('Attendance record not found');

    session.attendance[attendanceIndex].status = status;

    if (status === 'approved' || status === 'approve') {
      session.attendeeList = session.attendeeList.filter((a: any) => a.id !== userId);
      session.attendeeList.push({ id: userId, name });
    } else {
      session.attendeeList = session.attendeeList.filter((a: any) => a.id !== userId);
    }

    session.markModified('attendance');
    session.markModified('attendeeList');

    await session.save();
  }

  async recordAttendanceJoin(sessionId: string, userId: string): Promise<void> {
    const now = new Date();
    const result = await VideoSessionModel.findOneAndUpdate(
      {
        _id: sessionId,
        'attendance.userId': userId
      },
      {
        $push: {
          'attendance.$.intervals': { joinedAt: now }
        }
      },
      { new: true }
    );

    if (!result) {
      await VideoSessionModel.findOneAndUpdate(
        { _id: sessionId },
        {
          $push: {
            attendance: {
              userId: userId,
              intervals: [{ joinedAt: now }]
            }
          }
        },
        { new: true }
      );
    }
  }

  async recordAttendanceLeave(sessionId: string, userId: string): Promise<void> {
    const now = new Date();

    const session = await VideoSessionModel.findById(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const attendance = session.attendance.find((a: any) => a.userId === userId);
    if (!attendance || !attendance.intervals || attendance.intervals.length === 0) {
      throw new Error('No attendance record found');
    }

    const lastInterval = attendance.intervals[attendance.intervals.length - 1];
    if (lastInterval.leftAt) {
      throw new Error('No open join interval found');
    }

    const result = await VideoSessionModel.findOneAndUpdate(
      {
        _id: sessionId,
        'attendance.userId': userId
      },
      {
        $set: {
          'attendance.$.intervals.$[lastInterval].leftAt': now
        }
      },
      {
        new: true,
        arrayFilters: [
          { 'lastInterval.leftAt': { $exists: false } }
        ]
      }
    );

    if (!result) {
      throw new Error('Failed to update attendance leave');
    }
  }
} 