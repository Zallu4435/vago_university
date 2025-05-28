import { Router } from 'express';
import { clubController } from '../controllers/clubController';

const router = Router();

router.get('/club-requests', clubController.getClubRequests);
router.post('/club-requests/:id/approve', clubController.approveClubRequest);
router.post('/club-requests/:id/reject', clubController.rejectClubRequest);

// Club management routes
router.get('/', clubController.getClubs);
router.get('/:id', clubController.getClubById);
router.post('/', clubController.createClub);
router.put('/:id', clubController.updateClub);
router.delete('/:id', clubController.deleteClub);

// Club request management routes

// Member request management routes
router.get('/member-requests', clubController.getMemberRequests);
router.post('/member-requests/:id/approve', clubController.approveMemberRequest);
router.post('/member-requests/:id/reject', clubController.rejectMemberRequest);

export default router;