import { Router } from 'express';
import { communicationController } from '../controllers/communicationController';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';
import { messageAttachmentUpload } from '../../config/cloudinary.config';

const router = Router();

// Apply JWT authentication to all routes
router.use(authMiddleware);

// Inbox and sent messages
router.get('/inbox', communicationController.getInboxMessages);
router.get('/sent', communicationController.getSentMessages);

// Send and reply messages with file upload
router.post('/send', messageAttachmentUpload.array('attachments', 5), communicationController.sendMessage);
router.post('/reply/:messageId', messageAttachmentUpload.array('attachments', 5), communicationController.replyMessage);

// Message actions
router.delete('/messages/:messageId', communicationController.deleteMessage);
router.post('/archive/:messageId', communicationController.archiveMessage);
router.post('/read/:messageId', communicationController.markMessageAsRead);

export default router;