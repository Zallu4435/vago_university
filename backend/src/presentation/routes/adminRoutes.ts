import { Router } from 'express';
import { admissionController } from '../controllers/userController';

const router = Router();

router.get('/', admissionController.getAdmissions);

router.get('/:id', admissionController.getAdmissionById);

router.post('/:id/approve', admissionController.approveAdmission);

router.post('/:id/reject', admissionController.rejectAdmission);

router.delete('/:id', admissionController.deleteAdmission);

router.post('/:id/confirm/:action', admissionController.confirmOffer);


export default router;