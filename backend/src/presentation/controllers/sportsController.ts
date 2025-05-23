import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { getTeams } from '../../application/use-cases/sports/getTeams';
import { createTeam } from '../../application/use-cases/sports/createTeam';
import { updateTeam } from '../../application/use-cases/sports/updateTeam';
import { deleteTeam } from '../../application/use-cases/sports/deleteTeam';
import { getEvents } from '../../application/use-cases/sports/getEvents';
import { createEvent } from '../../application/use-cases/sports/createEvent';
import { getTeamRequests } from '../../application/use-cases/sports/getTeamRequests';
import { approveTeamRequest } from '../../application/use-cases/sports/approveTeamRequest';
import { rejectTeamRequest } from '../../application/use-cases/sports/rejectTeamRequest';
import { getPlayerRequests } from '../../application/use-cases/sports/getPlayerRequests';
import { approvePlayerRequest } from '../../application/use-cases/sports/approvePlayerRequest';
import { rejectPlayerRequest } from '../../application/use-cases/sports/rejectPlayerRequest';

class SportsController {
  async getTeams(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = '1', limit = '10', sportType = 'all', status = 'all', coach = 'all' } = req.query;

      console.log(`Received GET /api/admin/sports/teams with filters:`, {
        page,
        limit,
        sportType,
        status,
        coach,
      });

      if (isNaN(Number(page)) || isNaN(Number(limit)) || Number(page) < 1 || Number(limit) < 1) {
        return res.status(400).json({ error: 'Invalid page or limit parameters', code: 400 });
      }

      const result = await getTeams.execute({
        page: Number(page),
        limit: Number(limit),
        sportType: String(sportType),
        status: String(status),
        coach: String(coach),
      });

      res.status(200).json({
        teams: result.teams,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        currentPage: result.currentPage,
      });
    } catch (err) {
      console.error(`Error in getTeams:`, err);
      next(err);
    }
  }

  async createTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const teamData = req.body;
      console.log(`Received POST /api/admin/sports/teams with data:`, teamData);

      const team = await createTeam.execute(teamData);
      res.status(201).json(team);
    } catch (err) {
      console.error(`Error in createTeam:`, err);
      next(err);
    }
  }

  async updateTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const teamData = req.body;
      console.log(`Received PUT /api/admin/sports/teams/${id} with data:`, teamData);

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid team ID', code: 400 });
      }

      const team = await updateTeam.execute(id, teamData);
      if (!team) {
        return res.status(404).json({ error: 'Team not found', code: 404 });
      }

      res.status(200).json(team);
    } catch (err) {
      console.error(`Error in updateTeam:`, err);
      next(err);
    }
  }

  async deleteTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`Received DELETE /api/admin/sports/teams/${id}`);

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid team ID', code: 400 });
      }

      await deleteTeam.execute(id);
      res.status(200).json({ message: 'Team deleted successfully' });
    } catch (err) {
      console.error(`Error in deleteTeam:`, err);
      next(err);
    }
  }

  async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = '1', limit = '10', sportType = 'all', status = 'all' } = req.query;

      console.log(`Received GET /api/admin/sports/events with filters:`, {
        page,
        limit,
        sportType,
        status,
      });

      if (isNaN(Number(page)) || isNaN(Number(limit)) || Number(page) < 1 || Number(limit) < 1) {
        return res.status(400).json({ error: 'Invalid page or limit parameters', code: 400 });
      }

      const result = await getEvents.execute({
        page: Number(page),
        limit: Number(limit),
        sportType: String(sportType),
        status: String(status),
      });

      res.status(200).json({
        events: result.events,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        currentPage: result.currentPage,
      });
    } catch (err) {
      console.error(`Error in getEvents:`, err);
      next(err);
    }
  }

  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const eventData = req.body;
      console.log(`Received POST /api/admin/sports/events with data:`, eventData);

      const event = await createEvent.execute(eventData);
      res.status(201).json(event);
    } catch (err) {
      console.error(`Error in createEvent:`, err);
      next(err);
    }
  }

  async getTeamRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = '1', limit = '10', status = 'all' } = req.query;

      console.log(`Received GET /api/admin/sports/team-requests with filters:`, {
        page,
        limit,
        status,
      });

      if (isNaN(Number(page)) || isNaN(Number(limit)) || Number(page) < 1 || Number(limit) < 1) {
        return res.status(400).json({ error: 'Invalid page or limit parameters', code: 400 });
      }

      const result = await getTeamRequests.execute({
        page: Number(page),
        limit: Number(limit),
        status: String(status),
      });

      res.status(200).json({
        teamRequests: result.teamRequests,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        currentPage: result.currentPage,
      });
    } catch (err) {
      console.error(`Error in getTeamRequests:`, err);
      next(err);
    }
  }

  async approveTeamRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`Received POST /api/admin/sports/team-requests/${id}/approve`);

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid team request ID', code: 400 });
      }

      await approveTeamRequest.execute(id);
      res.status(200).json({ message: 'Team request approved successfully' });
    } catch (err) {
      console.error(`Error in approveTeamRequest:`, err);
      next(err);
    }
  }

  async rejectTeamRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      console.log(`Received POST /api/admin/sports/team-requests/${id}/reject with reason:`, reason);

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid team request ID', code: 400 });
      }
      if (!reason) {
        return res.status(400).json({ error: 'Reason is required for rejection', code: 400 });
      }

      await rejectTeamRequest.execute({ id, reason });
      res.status(200).json({ message: 'Team request rejected successfully' });
    } catch (err) {
      console.error(`Error in rejectTeamRequest:`, err);
      next(err);
    }
  }

  async getPlayerRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = '1', limit = '10', status = 'all' } = req.query;

      console.log(`Received GET /api/admin/sports/player-requests with filters:`, {
        page,
        limit,
        status,
      });

      if (isNaN(Number(page)) || isNaN(Number(limit)) || Number(page) < 1 || Number(limit) < 1) {
        return res.status(400).json({ error: 'Invalid page or limit parameters', code: 400 });
      }

      const result = await getPlayerRequests.execute({
        page: Number(page),
        limit: Number(limit),
        status: String(status),
      });

      res.status(200).json({
        playerRequests: result.playerRequests,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        currentPage: result.currentPage,
      });
    } catch (err) {
      console.error(`Error in getPlayerRequests:`, err);
      next(err);
    }
  }

  async approvePlayerRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`Received POST /api/admin/sports/player-requests/${id}/approve`);

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid player request ID', code: 400 });
      }

      await approvePlayerRequest.execute(id);
      res.status(200).json({ message: 'Player request approved successfully' });
    } catch (err) {
      console.error(`Error in approvePlayerRequest:`, err);
      next(err);
    }
  }

  async rejectPlayerRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      console.log(`Received POST /api/admin/sports/player-requests/${id}/reject with reason:`, reason);

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid player request ID', code: 400 });
      }
      if (!reason) {
        return res.status(400).json({ error: 'Reason is required for rejection', code: 400 });
      }

      await rejectPlayerRequest.execute({ id, reason });
      res.status(200).json({ message: 'Player request rejected successfully' });
    } catch (err) {
      console.error(`Error in rejectPlayerRequest:`, err);
      next(err);
    }
  }
}

export const sportsController = new SportsController();