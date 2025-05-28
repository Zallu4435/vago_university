import express from 'express';
import { communicationController } from '../controllers/userCommunicationController';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';

const router = express.Router();

// Shared routes (for both users and admins)
router.get('/inbox', authMiddleware, communicationController.getInboxMessages);
router.get('/sent', authMiddleware, communicationController.getSentMessages);
router.post('/send', authMiddleware, communicationController.sendMessage);
router.put('/messages/:messageId/read', authMiddleware, communicationController.markMessageAsRead);
router.delete('/messages/:messageId', authMiddleware, communicationController.deleteMessage);
router.get('/messages/:messageId', authMiddleware, communicationController.getMessageDetails);
router.get('/all-admins', authMiddleware, communicationController.getAllAdmins);
router.get('/user-groups', authMiddleware, communicationController.getUserGroups);

// Admin-specific routes
router.get('/admin/inbox', authMiddleware, communicationController.getAllInboxMessages);
router.get('/admin/sent', authMiddleware, communicationController.getAllSentMessages);
router.post('/admin/send', authMiddleware, communicationController.sendMessage);


export default router;