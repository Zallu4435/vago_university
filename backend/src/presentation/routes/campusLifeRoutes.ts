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

// Sports
router.get('/sports', campusLifeController.getSports);
router.get('/sports/:sportId', campusLifeController.getSportById);

// Clubs
router.get('/clubs', campusLifeController.getClubs);
router.get('/clubs/:clubId', campusLifeController.getClubById);

export default router;