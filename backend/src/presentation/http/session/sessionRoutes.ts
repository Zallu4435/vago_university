import { Router } from 'express';
import { getVideoSessionComposer } from '../../../infrastructure/services/session/SessionComposer';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';

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
sessionRouter.post('/video-sessions/:id/attendance/join', authMiddleware, (req, res) =>
  expressAdapter(req, res, sessionController.recordAttendanceJoin.bind(sessionController))
);
sessionRouter.post('/video-sessions/:id/attendance/leave', authMiddleware, (req, res) =>
  expressAdapter(req, res, sessionController.recordAttendanceLeave.bind(sessionController))
);
sessionRouter.put('/video-sessions/:sessionId/attendance/:userId/status', authMiddleware, async (req, res) =>
  expressAdapter(req, res, sessionController.updateAttendanceStatus.bind(sessionController))
);
sessionRouter.get('/video-sessions/:id/attendance', authMiddleware, (req, res) =>
  expressAdapter(req, res, sessionController.getSessionAttendance.bind(sessionController))
);

export default sessionRouter; 