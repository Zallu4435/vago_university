import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { getCampusLifeOverview } from '../../application/use-cases/campus-life/getCampusLifeOverview';
import { getEvents } from '../../application/use-cases/campus-life/getEvents';
import { getEventById } from '../../application/use-cases/campus-life/getEventById';
import { getSports } from '../../application/use-cases/campus-life/getSports';
import { getSportById } from '../../application/use-cases/campus-life/getSportById';
import { getClubs } from '../../application/use-cases/campus-life/getClubs';
import { getClubById } from '../../application/use-cases/campus-life/getClubById';
import { joinClub } from '../../application/use-cases/campus-life/joinClub';
import { joinSport } from '../../application/use-cases/campus-life/joinSport';
import { joinEvent } from '../../application/use-cases/campus-life/joinEvent';

class CampusLifeController {
  async getCampusLifeOverview(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log(`Received GET /api/campus-life`);

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }

      const result = await getCampusLifeOverview.execute();

      res.status(200).json(result);
    } catch (err: any) {
      console.error(`Error in getCampusLifeOverview:`, err);
      res.status(500).json({
        error: {
          message: err.message,
          code: 'INTERNAL_SERVER_ERROR',
          status: 500,
        },
      });
    }
  }

  async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = '1', limit = '10', search = '', status = 'all' } = req.query;

      // console.log(`Received GET /api/campus-life/events with filters:`, { page, limit, search, status });

      if (isNaN(Number(page)) || isNaN(Number(limit)) || Number(page) < 1 || Number(limit) < 1) {
        return res.status(400).json({
          error: {
            message: 'Invalid page or limit parameters',
            code: 'INVALID_PARAMETERS',
            status: 400,
          },
        });
      }

      if (status && !['upcoming', 'past', 'all'].includes(String(status))) {
        return res.status(400).json({
          error: {
            message: 'Invalid status; must be "upcoming", "past", or "all"',
            code: 'INVALID_STATUS',
            status: 400,
          },
        });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }

      const result = await getEvents.execute({
        page: Number(page),
        limit: Number(limit),
        search: String(search),
        status: String(status) as 'upcoming' | 'past' | 'all',
      });

      res.status(200).json({
        data: result.events,
        total: result.total,
        page: result.page,
        limit: result.limit,
      });
    } catch (err: any) {
      console.error(`Error in getEvents:`, err);
      res.status(500).json({
        error: {
          message: err.message,
          code: 'INTERNAL_SERVER_ERROR',
          status: 500,
        },
      });
    }
  }

  async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;

      // console.log(`Received GET /api/campus-life/events/${eventId}`);

      if (!mongoose.isValidObjectId(eventId)) {
        return res.status(400).json({
          error: {
            message: 'Invalid event ID',
            code: 'INVALID_ID',
            status: 400,
          },
        });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }

      if (req.user.collection !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Only admins can access this endpoint' });
      }

      const event = await getEventById.execute({ eventId });

      res.status(200).json(event);
    } catch (err: any) {
      console.error(`Error in getEventById:`, err);
      res.status(err.message.includes('not found') ? 404 : 500).json({
        error: {
          message: err.message,
          code: err.message.includes('not found') ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
          status: err.message.includes('not found') ? 404 : 500,
        },
      });
    }
  }

  async getSports(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, search = '' } = req.query;

      // console.log(`Received GET /api/campus-life/sports with filters:`, { type, search });

      if (type && !['VARSITY SPORTS', 'INTRAMURAL SPORTS'].includes(String(type))) {
        return res.status(400).json({
          error: {
            message: 'Invalid type; must be "VARSITY SPORTS" or "INTRAMURAL SPORTS"',
            code: 'INVALID_TYPE',
            status: 400,
          },
        });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }

      const result = await getSports.execute({
        type: type ? String(type) as 'VARSITY SPORTS' | 'INTRAMURAL SPORTS' : undefined,
        search: String(search),
      });

      res.status(200).json({
        data: result.sports,
        total: result.total,
      });
    } catch (err: any) {
      console.error(`Error in getSports:`, err);
      res.status(500).json({
        error: {
          message: err.message,
          code: 'INTERNAL_SERVER_ERROR',
          status: 500,
        },
      });
    }
  }

  async getSportById(req: Request, res: Response, next: NextFunction) {
    try {
      const { sportId } = req.params;

      // console.log(`Received GET /api/campus-life/sports/${sportId}`);

      if (!mongoose.isValidObjectId(sportId)) {
        return res.status(400).json({
          error: {
            message: 'Invalid sport ID',
            code: 'INVALID_ID',
            status: 400,
          },
        });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }

      const sport = await getSportById.execute({ sportId });

      res.status(200).json(sport);
    } catch (err: any) {
      console.error(`Error in getSportById:`, err);
      res.status(err.message.includes('not found') ? 404 : 500).json({
        error: {
          message: err.message,
          code: err.message.includes('not found') ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
          status: err.message.includes('not found') ? 404 : 500,
        },
      });
    }
  }

  async getClubs(req: Request, res: Response, next: NextFunction) {
    try {
      const { search = '', type, status = 'all' } = req.query;

      // console.log(`Received GET /api/campus-life/clubs with filters:`, { search, type, status });

      if (status && !['active', 'inactive', 'all'].includes(String(status))) {
        return res.status(400).json({
          error: {
            message: 'Invalid status; must be "active", "inactive", or "all"',
            code: 'INVALID_STATUS',
            status: 400,
          },
        });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }

      const result = await getClubs.execute({
        search: String(search),
        type: type ? String(type) : undefined,
        status: String(status) as 'active' | 'inactive' | 'all',
      });

      res.status(200).json({
        data: result.clubs,
        total: result.total,
      });
    } catch (err: any) {
      console.error(`Error in getClubs:`, err);
      res.status(500).json({
        error: {
          message: err.message,
          code: 'INTERNAL_SERVER_ERROR',
          status: 500,
        },
      });
    }
  }

  async getClubById(req: Request, res: Response, next: NextFunction) {
    try {
      const { clubId } = req.params;

      // console.log(`Received GET /api/campus-life/clubs/${clubId}`);

      if (!mongoose.isValidObjectId(clubId)) {
        return res.status(400).json({
          error: {
            message: 'Invalid club ID',
            code: 'INVALID_ID',
            status: 400,
          },
        });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }

      const club = await getClubById.execute({ clubId });

      res.status(200).json(club);
    } catch (err: any) {
      console.error(`Error in getClubById:`, err);
      res.status(err.message.includes('not found') ? 404 : 500).json({
        error: {
          message: err.message,
          code: err.message.includes('not found') ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
          status: err.message.includes('not found') ? 404 : 500,
        },
      });
    }
  }

  async joinClub(req: Request, res: Response, next: NextFunction) {
    try {
      const { clubId } = req.params;
      const { reason, additionalInfo } = req.body;

      console.log(req.user)
      const studentId = req.user?.id
      console.log(`Received POST /api/campus-life/clubs/${clubId}/join`);
      console.log(studentId, "lkokooooooooooooooooooooooooooooooooooooooooooo")

      if (!mongoose.isValidObjectId(clubId)) {
        return res.status(400).json({
          error: {
            message: 'Invalid club ID',
            code: 'INVALID_ID',
            status: 400,
          },
        });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }

      if (!reason || !studentId) {
        return res.status(400).json({
          error: {
            message: 'Reason and studentId are required',
            code: 'MISSING_FIELDS',
            status: 400,
          },
        });
      }

      if (!mongoose.isValidObjectId(studentId)) {
        return res.status(400).json({
          error: {
            message: 'Invalid student ID',
            code: 'INVALID_ID',
            status: 400,
          },
        });
      }

      const result = await joinClub.execute({
        clubId,
        studentId,
        reason,
        additionalInfo,
      });

      res.status(200).json({
        success: true,
        message: 'Join request submitted successfully.',
        requestId: result.requestId,
        status: result.status,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error(`Error in joinClub:`, err);
      res.status(err.message.includes('not found') ? 404 : 500).json({
        error: {
          message: err.message,
          code: err.message.includes('not found') ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
          status: err.message.includes('not found') ? 404 : 500,
        },
      });
    }
  }

  async joinSport(req: Request, res: Response, next: NextFunction) {
    try {
      const { sportId } = req.params;
      const { reason, additionalInfo } = req.body;

      const studentId = req.user?.id

      console.log(`Received POST /api/campus-life/sports/${sportId}/join`);

      if (!mongoose.isValidObjectId(sportId)) {
        return res.status(400).json({
          error: {
            message: 'Invalid sport ID',
            code: 'INVALID_ID',
            status: 400,
          },
        });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }

      if (!reason || !studentId) {
        return res.status(400).json({
          error: {
            message: 'Reason and studentId are required',
            code: 'MISSING_FIELDS',
            status: 400,
          },
        });
      }

      if (!mongoose.isValidObjectId(studentId)) {
        return res.status(400).json({
          error: {
            message: 'Invalid student ID',
            code: 'INVALID_ID',
            status: 400,
          },
        });
      }

      const result = await joinSport.execute({
        sportId,
        studentId,
        reason,
        additionalInfo,
      });

      res.status(200).json({
        success: true,
        message: 'Join request submitted successfully.',
        requestId: result.requestId,
        status: result.status,
        tryoutDate: result.tryoutDate,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error(`Error in joinSport:`, err);
      res.status(err.message.includes('not found') ? 404 : 500).json({
        error: {
          message: err.message,
          code: err.message.includes('not found') ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
          status: err.message.includes('not found') ? 404 : 500,
        },
      });
    }
  }

  async joinEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const { reason, additionalInfo } = req.body;
      const studentId = req.user?.id

      console.log(`Received POST /api/campus-life/events/${eventId}/join`);

      if (!mongoose.isValidObjectId(eventId)) {
        return res.status(400).json({
          error: {
            message: 'Invalid event ID',
            code: 'INVALID_ID',
            status: 400,
          },
        });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }

      if (!reason || !studentId) {
        return res.status(400).json({
          error: {
            message: 'Reason and studentId are required',
            code: 'MISSING_FIELDS',
            status: 400,
          },
        });
      }

      if (!mongoose.isValidObjectId(studentId)) {
        return res.status(400).json({
          error: {
            message: 'Invalid student ID',
            code: 'INVALID_ID',
            status: 400,
          },
        });
      }

      const result = await joinEvent.execute({
        eventId,
        studentId,
        reason,
        additionalInfo,
      });

      res.status(200).json({
        success: true,
        message: 'Join request submitted successfully.',
        requestId: result.requestId,
        status: result.status,
        registrationCode: result.registrationCode,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error(`Error in joinEvent:`, err);
      res.status(err.message.includes('not found') ? 404 : 500).json({
        error: {
          message: err.message,
          code: err.message.includes('not found') ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
          status: err.message.includes('not found') ? 404 : 500,
        },
      });
    }
  }
}

export const campusLifeController = new CampusLifeController();