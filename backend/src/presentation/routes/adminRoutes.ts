// backend/src/routes/admissionRoutes.ts
import { Router } from 'express';
import { admissionController } from '../controllers/userController';

const router = Router();

// Get all admissions with filtering and pagination
router.get('/', admissionController.getAdmissions);

// Get admission details by ID
router.get('/:id', admissionController.getAdmissionById);

// Approve an admission
router.post('/:id/approve', admissionController.approveAdmission);

// Delete an admission
router.delete('/:id', admissionController.deleteAdmission);

export default router;