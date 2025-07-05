import { Router } from 'express';
import { getVideoSessionComposer } from '../../../infrastructure/services/session/SessionComposer';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { VideoSessionModel } from '../../../infrastructure/database/mongoose/models/session.model';

const sessionRouter = Router();
const sessionController = getVideoSessionComposer();

sessionRouter.post('/video-sessions', authMiddleware, (req, res) =>
  expressAdapter(req, res, sessionController.createSession.bind(sessionController))
);
sessionRouter.post('/video-sessions/:id/join', authMiddleware, (req, res) =>
  expressAdapter(req, res, sessionController.joinSession.bind(sessionController))
);
sessionRouter.get('/video-sessions/:id', authMiddleware, (req, res) =>
  expressAdapter(req, res, sessionController.getSession.bind(sessionController))
);
sessionRouter.put('/video-sessions/:id', authMiddleware, (req, res) =>
  expressAdapter(req, res, sessionController.updateSession.bind(sessionController))
);
sessionRouter.delete('/video-sessions/:id', authMiddleware, (req, res) =>
  expressAdapter(req, res, sessionController.deleteSession.bind(sessionController))
);
sessionRouter.get('/video-sessions', authMiddleware, (req, res) =>
  expressAdapter(req, res, sessionController.getAllSessions.bind(sessionController))
);
sessionRouter.put('/video-sessions/:id/status', authMiddleware, (req, res) =>
  expressAdapter(req, res, sessionController.updateSessionStatus.bind(sessionController))
);
sessionRouter.post('/video-sessions/:id/attendance/join', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const now = new Date();
  console.log('[Attendance Join] Endpoint hit for session:', id, 'user:', userId);
  try {
    const session = await VideoSessionModel.findById(id);
    if (!session) {
      console.log('[Attendance Join] Session not found:', id);
      res.status(404).json({ message: 'Session not found' });
      return;
    }
    let attendance = session.attendance.find((a: any) => a.userId === userId);
    if (!attendance) {
      attendance = { userId, intervals: [] };
      session.attendance.push(attendance);
    }
    attendance.intervals.push({ joinedAt: now });
    await session.save();
    console.log('[Attendance Join] Join recorded for user:', userId, 'in session:', id);
    res.status(200).json({ message: 'Join recorded' });
  } catch (err) {
    console.error('[Attendance Join] Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

sessionRouter.post('/video-sessions/:id/attendance/leave', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const now = new Date();
  console.log('[Attendance Leave] Endpoint hit for session:', id, 'user:', userId);
  const session = await VideoSessionModel.findById(id);
  if (!session) {
    console.log('[Attendance Leave] Session not found:', id);
    res.status(404).json({ message: 'Session not found' });
    return;
  }
  const attendance = session.attendance.find((a: any) => a.userId === userId);
  if (attendance && attendance.intervals.length > 0) {
    const lastInterval = attendance.intervals[attendance.intervals.length - 1];
    if (!lastInterval.leftAt) {
      lastInterval.leftAt = now;
      await session.save();
      console.log('[Attendance Leave] Leave recorded for user:', userId, 'in session:', id);
      res.status(200).json({ message: 'Leave recorded' });
      return;
    }
  }
  console.log('[Attendance Leave] No open join interval found for user:', userId, 'in session:', id);
  res.status(400).json({ message: 'No open join interval found' });
});

sessionRouter.put('/video-sessions/:sessionId/attendance/:userId/status', authMiddleware, async (req, res) =>
  expressAdapter(req, res, sessionController.updateAttendanceStatus.bind(sessionController))
);

sessionRouter.get('/video-sessions/:id/attendance', authMiddleware, (req, res) =>
  expressAdapter(req, res, sessionController.getSessionAttendance.bind(sessionController))
);

export default sessionRouter; 