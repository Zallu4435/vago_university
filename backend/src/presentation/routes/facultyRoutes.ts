import { Router } from 'express';
import { facultyController } from '../controllers/facultyController';

const router = Router();

// Get all faculty members with filtering and pagination
router.get('/', facultyController.getFaculty);

// Get faculty details by ID
router.get('/:id', facultyController.getFacultyById);

// Approve a faculty registration
router.post('/:id/approve', facultyController.approveFaculty);

router.post('/:id/reject', facultyController.rejectFaculty);

// Delete an admission
// router.delete('/:id', facultyController.deleteAdmission);

router.post('/:id/confirm/:action', facultyController.confirmOffer);

export default router;