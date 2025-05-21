import { Router } from 'express';
import { facultyController } from '../controllers/facultyController';

const router = Router();

router.get('/', facultyController.getFaculty);

router.get('/:id', facultyController.getFacultyById);

router.post('/:id/approve', facultyController.approveFaculty);

router.post('/:id/reject', facultyController.rejectFaculty);

// router.delete('/:id', facultyController.deleteAdmission);

router.post('/:id/confirm/:action', facultyController.confirmOffer);

export default router;