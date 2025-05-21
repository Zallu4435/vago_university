import { Router } from 'express';
import { admissionController } from '../controllers/admissionController';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';

const router = Router();

router.post('/applications', authMiddleware, admissionController.createApplication);

router.get('/applications/user/:userId', authMiddleware, admissionController.getApplication);

router.post('/applications/:applicationId/sections/:section', authMiddleware, admissionController.saveSection);

router.post('/payment/process', authMiddleware, admissionController.processPayment);

router.post('/finalize', authMiddleware, admissionController.handleFinalSubmit);

export default router;