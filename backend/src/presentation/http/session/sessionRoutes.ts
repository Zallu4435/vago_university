import { Router } from 'express';
import { getVideoSessionComposer } from '../../../infrastructure/services/session/SessionComposer';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';

const sessionRouter = Router();
const sessionController = getVideoSessionComposer();

sessionRouter.post('/video-sessions', authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, sessionController.createSession.bind(sessionController))
);
sessionRouter.post('/video-sessions/:id/join', authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, sessionController.joinSession.bind(sessionController))
);
sessionRouter.get('/video-sessions/:id', authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, sessionController.getSession.bind(sessionController))
);
sessionRouter.put('/video-sessions/:id', authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, sessionController.updateSession.bind(sessionController))
);
sessionRouter.delete('/video-sessions/:id', authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, sessionController.deleteSession.bind(sessionController))
);
sessionRouter.get('/video-sessions', authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, sessionController.getAllSessions.bind(sessionController))
);
sessionRouter.put('/video-sessions/:id/status', authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, sessionController.updateSessionStatus.bind(sessionController))
);
sessionRouter.post('/video-sessions/:id/attendance/join', authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, sessionController.recordAttendanceJoin.bind(sessionController))
);
sessionRouter.post('/video-sessions/:id/attendance/leave', authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, sessionController.recordAttendanceLeave.bind(sessionController))
);
sessionRouter.put('/video-sessions/:sessionId/attendance/:userId/status', authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, sessionController.updateAttendanceStatus.bind(sessionController))
);
sessionRouter.get('/video-sessions/:id/attendance', authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, sessionController.getSessionAttendance.bind(sessionController))
);

export default sessionRouter; 