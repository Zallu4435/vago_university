import { ISessionRepository } from '../../../application/session/repositories/ISessionRepository';
import { VideoSession } from '../../../domain/session/entities/VideoSession';
import { VideoSessionModel } from '../../database/mongoose/models/session.model';
import { User } from '../../database/mongoose/auth/user.model';

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

  async getAll(params: { search?: string; status?: string; instructor?: string; course?: string } = {}): Promise<VideoSession[]> {
    const query: any = {};

    if (params.status && params.status !== 'all') {
      if (params.status === 'upcoming') {
        // Search for both 'upcoming' and 'scheduled' statuses
        query.$or = [
          { status: 'upcoming' },
          { status: 'scheduled' }
        ];
      } else {
        query.status = params.status;
      }
    }

    if (params.instructor && params.instructor !== 'all') {
      query.instructor = params.instructor;
    }

    if (params.course && params.course !== 'all') {
      query.course = params.course;
    }

    if (params.search && params.search.trim()) {
      const searchRegex = new RegExp(params.search.trim(), 'i');
      const searchConditions = [
        { title: searchRegex },
        { description: searchRegex },
        { instructor: searchRegex },
        { course: searchRegex }
      ];

      if (query.$or) {
        query.$and = [
          { $or: query.$or },
          { $or: searchConditions } 
        ];
        delete query.$or; 
      } else {
        query.$or = searchConditions;
      }
    }

    const sessions = await VideoSessionModel.find(query).sort({ createdAt: -1 });
    return sessions.map(doc => doc.toObject() as VideoSession);
  }

  async getSessionAttendance(sessionId: string, filters: any = {}) {
    const session = await VideoSessionModel.findById(sessionId);
    if (!session) throw new Error('Session not found');
    let attendance = session.attendance || [];

    if (filters.search && filters.search.trim() !== '') {
      const search = filters.search.toLowerCase();
      const userIds = attendance.map((a) => a.userId);
      const users = await User.find({ _id: { $in: userIds } }).lean();
      const userMap = new Map(users.map((u) => [u._id.toString(), u]));
      attendance = attendance.filter((a) => {
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

      attendance = attendance.filter((a) => {

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
      attendance = attendance.filter((a) => {
        let totalMinutes = 0;
        if (Array.isArray(a.intervals)) {
          totalMinutes = a.intervals.reduce((sum: number, interval) => {
            if (interval.joinedAt && interval.leftAt) {
              const joined = new Date(interval.joinedAt).getTime();
              const left = new Date(interval.leftAt).getTime();
              if (!isNaN(joined) && !isNaN(left) && left > joined) {
                return sum + (left - joined) / 60000;
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

    if (filters.startDate || filters.endDate) {
      attendance = attendance.filter((a) => {
        if (!Array.isArray(a.intervals) || a.intervals.length === 0) {
          return false;
        }

        return a.intervals.some((interval) => {
          if (!interval.joinedAt) return false;

          const joinDate = new Date(interval.joinedAt);
          let startDate = null;
          let endDate = null;

          if (filters.startDate) {
            startDate = new Date(filters.startDate);
            startDate.setHours(0, 0, 0, 0);
          }

          if (filters.endDate) {
            endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999);
          }

          if (startDate && joinDate < startDate) return false;

          if (endDate && joinDate > endDate) return false;

          return true;
        });
      });
    }

    const userIds = attendance.map((a) => a.userId);
    const users = await User.find({ _id: { $in: userIds } }).lean();
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));
    const result = attendance
      .filter((a) => userMap.has(a.userId))
      .map((a) => {
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

    const attendanceIndex = session.attendance.findIndex((a) => a.userId === userId);
    if (attendanceIndex === -1) throw new Error('Attendance record not found');

    session.attendance[attendanceIndex].status = status;

    if (status === 'approved' || status === 'approve') {
      session.attendeeList = session.attendeeList.filter((a) => a.id !== userId);
      session.attendeeList.push({ id: userId, name });
    } else {
      session.attendeeList = session.attendeeList.filter((a) => a.id !== userId);
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

    const attendance = session.attendance.find((a) => a.userId === userId);
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