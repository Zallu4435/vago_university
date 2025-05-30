import { Router } from 'express';
import { sportsController } from '../controllers/sportsController';

const router = Router();

router.get('/teams', sportsController.getTeams);
router.get('/teams/:id', sportsController.getTeamById);
router.post('/teams', sportsController.createTeam);
router.put('/teams/:id', sportsController.updateTeam);
router.delete('/teams/:id', sportsController.deleteTeam);


// Player request management routes
router.get('/player-requests', sportsController.getPlayerRequests);
router.get('/player-requests/:id', sportsController.getTeamRequestDetails);
router.post('/player-requests/:id/approve', sportsController.approvePlayerRequest);
router.post('/player-requests/:id/reject', sportsController.rejectPlayerRequest);

export default router;