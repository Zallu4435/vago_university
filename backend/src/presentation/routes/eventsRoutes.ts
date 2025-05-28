import { Router } from 'express';
import { eventsController } from '../controllers/eventsController';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';

const router = Router();

router.get('/requests', authMiddleware,eventsController.getEventRequests);
router.post('/requests/:id/approve', authMiddleware, eventsController.approveEventRequest);
router.post('/requests/:id/reject', authMiddleware, eventsController.rejectEventRequest);

// Event management routes
router.get('/', authMiddleware, eventsController.getEvents);
router.get('/:id', authMiddleware, eventsController.getEventById);
router.post('/', authMiddleware, eventsController.createEvent);
router.put('/:id', authMiddleware, eventsController.updateEvent);
router.delete('/:id', authMiddleware, eventsController.deleteEvent);
    
// Event request management routes

// Participant management routes
router.get('/participants', authMiddleware, eventsController.getParticipants);
router.post('/participants/:id/approve', authMiddleware, eventsController.approveParticipant);
router.post('/participants/:id/reject', authMiddleware, eventsController.rejectParticipant);
router.delete('/participants/:id', authMiddleware, eventsController.deleteParticipant);

export default router;