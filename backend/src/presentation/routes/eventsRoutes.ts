import { Router } from 'express';
import { eventsController } from '../controllers/eventsController';

const router = Router();

// Event management routes
router.get('/', eventsController.getEvents);
router.get('/:id', eventsController.getEventById);
router.post('/', eventsController.createEvent);
router.put('/:id', eventsController.updateEvent);
router.delete('/:id', eventsController.deleteEvent);

// Event request management routes
router.get('/requests', eventsController.getEventRequests);
router.post('/requests/:id/approve', eventsController.approveEventRequest);
router.post('/requests/:id/reject', eventsController.rejectEventRequest);

// Participant management routes
router.get('/participants', eventsController.getParticipants);
router.post('/participants/:id/approve', eventsController.approveParticipant);
router.post('/participants/:id/reject', eventsController.rejectParticipant);
router.delete('/participants/:id', eventsController.deleteParticipant);

export default router;