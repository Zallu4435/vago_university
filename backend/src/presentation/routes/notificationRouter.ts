import { Router } from 'express';
import { notificationController } from '../controllers/notificationController';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, notificationController.createNotification);
router.get('/', authMiddleware, notificationController.getAllNotifications);
router.get('/:notificationId', authMiddleware, notificationController.getIndividualNotification);
router.delete('/:notificationId', authMiddleware, notificationController.deleteNotification);

export default router;