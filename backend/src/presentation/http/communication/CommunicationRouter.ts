import { Router, Request, Response } from 'express';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { getCommunicationComposer } from '../../../infrastructure/services/communication/CommunicationComposers';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { messageAttachmentUpload } from '../../../config/cloudinary.config';
const communicationRouter = Router();
const communicationController = getCommunicationComposer();

// Admin routes
communicationRouter.get(
  '/admin/users',
  authMiddleware,
  (req: Request, res: Response, next) => expressAdapter(req, res, next, communicationController.fetchUsers.bind(communicationController))
);

communicationRouter.get(
  '/admin/inbox',
  authMiddleware,
  (req: Request, res: Response, next) => expressAdapter(req, res, next, communicationController.getAdminInboxMessages.bind(communicationController))
);

communicationRouter.get(
  '/admin/sent',
  authMiddleware,
  (req: Request, res: Response, next) => expressAdapter(req, res, next, communicationController.getAdminSentMessages.bind(communicationController))
);

communicationRouter.post(
  '/admin/messages',
  authMiddleware,
  messageAttachmentUpload.array('attachments', 5),
  (req: Request, res: Response, next) => expressAdapter(req, res, next, communicationController.sendAdminMessage.bind(communicationController))
);

communicationRouter.delete(
  '/admin/messages/:messageId',
  authMiddleware,
  (req: Request, res: Response, next) => expressAdapter(req, res, next, communicationController.deleteAdminMessage.bind(communicationController))
);

// User routes
communicationRouter.get(
  '/inbox',
  authMiddleware,
  (req: Request, res: Response, next) => expressAdapter(req, res, next, communicationController.getInboxMessages.bind(communicationController))
);

communicationRouter.get(
  '/sent',
  authMiddleware,
  (req: Request, res: Response, next) => expressAdapter(req, res, next, communicationController.getSentMessages.bind(communicationController))
);

communicationRouter.post(
  '/send',
  messageAttachmentUpload.array('attachments', 5),
  (req: Request, res: Response, next) => expressAdapter(req, res, next, communicationController.sendMessage.bind(communicationController))
);

communicationRouter.put(
  '/messages/:messageId/read',
  authMiddleware,
  (req: Request, res: Response, next) => expressAdapter(req, res, next, communicationController.markMessageAsRead.bind(communicationController))
);

communicationRouter.delete(
  '/messages/:messageId',
  authMiddleware,
  (req: Request, res: Response, next) => expressAdapter(req, res, next, communicationController.deleteMessage.bind(communicationController))
);

communicationRouter.get(
  '/messages/:messageId',
  authMiddleware,
  (req: Request, res: Response, next) => expressAdapter(req, res, next, communicationController.getMessageDetails.bind(communicationController))
);

communicationRouter.get(
  '/all-admins',
  authMiddleware,
  (req: Request, res: Response, next) => expressAdapter(req, res, next, communicationController.getAllAdmins.bind(communicationController))
);

communicationRouter.get(
  '/user-groups',
  authMiddleware,
  (req: Request, res: Response, next) => expressAdapter(req, res, next, communicationController.getUserGroups.bind(communicationController))
);

communicationRouter.get(
  '/users',
  authMiddleware,
  (req: Request, res: Response, next) => expressAdapter(req, res, next, communicationController.fetchUsers.bind(communicationController))
);

export default communicationRouter;