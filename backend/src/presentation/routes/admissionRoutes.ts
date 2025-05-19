import { Router } from 'express';
import { admissionController } from '../controllers/admissionController';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';

const router = Router();

// Create a new application draft for the authenticated user
router.post('/applications', authMiddleware, admissionController.createApplication);

// Fetch application draft by userId
router.get('/applications/user/:userId', authMiddleware, admissionController.getApplication);

// Save section data (e.g., personalInfo, choiceOfStudy)
router.post('/applications/:applicationId/sections/:section', authMiddleware, admissionController.saveSection);

// Process payment
router.post('/payment/process', authMiddleware, admissionController.processPayment);

// Finalize admission (submit form and process payment)
router.post('/finalize', authMiddleware, admissionController.handleFinalSubmit);

export default router;