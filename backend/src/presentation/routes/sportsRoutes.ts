import { Router } from 'express';
import { sportsController } from '../controllers/sportsController';

const router = Router();

// Team management routes
router.get('/teams', sportsController.getTeams);
router.post('/teams', sportsController.createTeam);
router.put('/teams/:id', sportsController.updateTeam);
router.delete('/teams/:id', sportsController.deleteTeam);

// Event management routes
router.get('/events', sportsController.getEvents);
router.post('/events', sportsController.createEvent);

// Team request management routes
router.get('/team-requests', sportsController.getTeamRequests);
router.post('/team-requests/:id/approve', sportsController.approveTeamRequest);
router.post('/team-requests/:id/reject', sportsController.rejectTeamRequest);

// Player request management routes
router.get('/player-requests', sportsController.getPlayerRequests);
router.post('/player-requests/:id/approve', sportsController.approvePlayerRequest);
router.post('/player-requests/:id/reject', sportsController.rejectPlayerRequest);

export default router;