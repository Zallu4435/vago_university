import { Router } from 'express';
import { campusLifeController } from '../controllers/campusLifeController';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';

const router = Router();

// Apply JWT authentication to all routes
router.use(authMiddleware);

// Campus life overview
router.get('/', campusLifeController.getCampusLifeOverview);

// Events
router.get('/events', campusLifeController.getEvents);
router.get('/events/:eventId', campusLifeController.getEventById);
router.post('/events/:eventId/join', campusLifeController.joinEvent); // New endpoint

// Sports
router.get('/sports', campusLifeController.getSports);
router.get('/sports/:sportId', campusLifeController.getSportById);
router.post('/sports/:sportId/join', campusLifeController.joinSport); // New endpoint

// Clubs
router.get('/clubs', campusLifeController.getClubs);
router.get('/clubs/:clubId', campusLifeController.getClubById);
router.post('/clubs/:clubId/join', campusLifeController.joinClub); // New endpoint

export default router;