import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { getEvents } from "../../application/use-cases/events/getEvents";
import { getEventById } from "../../application/use-cases/events/getEventById";
import { createEvent } from "../../application/use-cases/events/createEvent";
import { updateEvent } from "../../application/use-cases/events/updateEvent";
import { deleteEvent } from "../../application/use-cases/events/deleteEvent";
import { getEventRequests } from "../../application/use-cases/events/getEventRequests";
import { approveEventRequest } from "../../application/use-cases/events/approveEventRequest";
import { rejectEventRequest } from "../../application/use-cases/events/rejectEventRequest";
import { getParticipants } from "../../application/use-cases/events/getParticipants";
import { approveParticipant } from "../../application/use-cases/events/approveParticipant";
import { rejectParticipant } from "../../application/use-cases/events/rejectParticipant";
import { deleteParticipant } from "../../application/use-cases/events/deleteParticipant";

class EventsController {
  async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = "1",
        limit = "10",
        type = "all",
        status = "all",
        organizer = "all",
      } = req.query;

      // console.log(`Received GET /api/admin/events with filters:`, {
      //   page,
      //   limit,
      //   type,
      //   status,
      //   organizer,
      // });

      if (
        isNaN(Number(page)) ||
        isNaN(Number(limit)) ||
        Number(page) < 1 ||
        Number(limit) < 1
      ) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Invalid page or limit parameters",
          statusCode: 400,
        });
      }

      const result = await getEvents.execute({
        page: Number(page),
        limit: Number(limit),
        type: String(type),
        status: String(status),
        organizer: String(organizer),
      });

      res.status(200).json({
        events: result.events,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        currentPage: result.currentPage,
      });
    } catch (err: any) {
      console.error(`Error in getEvents:`, err);
      res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
        statusCode: 500,
      });
    }
  }

  async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // console.log(`Received GET /api/admin/events/${id}`);

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Invalid event ID",
          statusCode: 400,
        });
      }

      const event = await getEventById.execute(id);
      if (!event) {
        return res.status(404).json({
          error: "Not Found",
          message: "Event not found",
          statusCode: 404,
        });
      }

      res.status(200).json(event);
    } catch (err: any) {
      console.error(`Error in getEventById:`, err);
      res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
        statusCode: 500,
      });
    }
  }

  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const eventData = req.body;
      console.log(`Received POST /api/admin/events with data:`, eventData);

      const event = await createEvent.execute(eventData);
      res.status(201).json(event);
    } catch (err: any) {
      console.error(`Error in createEvent:`, err);
      res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
        statusCode: 500,
      });
    }
  }

  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const eventData = req.body;
      console.log(`Received PUT /api/admin/events/${id} with data:`, eventData);

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Invalid event ID",
          statusCode: 400,
        });
      }

      const event = await updateEvent.execute(id, eventData);
      if (!event) {
        return res.status(404).json({
          error: "Not Found",
          message: "Event not found",
          statusCode: 404,
        });
      }

      res.status(200).json(event);
    } catch (err: any) {
      console.error(`Error in updateEvent:`, err);
      res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
        statusCode: 500,
      });
    }
  }

  async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`Received DELETE /api/admin/events/${id}`);

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Invalid event ID",
          statusCode: 400,
        });
      }

      await deleteEvent.execute(id);
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (err: any) {
      console.error(`Error in deleteEvent:`, err);
      res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
        statusCode: 500,
      });
    }
  }

  async getEventRequests(req: Request, res: Response, next: NextFunction) {
    try {

      const {
        page = "1",
        limit = "10",
        type = "all",
        status = "all",
        organizer = "all",
      } = req.query;

      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);

      if (
        isNaN(pageNumber) ||
        isNaN(limitNumber) ||
        pageNumber < 1 ||
        limitNumber < 1
      ) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Invalid page or limit parameters",
          statusCode: 400,
        });
      }

      console.log("reached unde the andndndnnnd")

      const result = await getEventRequests.execute({
        page: Number(page),
        limit: Number(limit),
        type: String(type),
        status: String(status),
        organizer: String(organizer),
      });

      res.status(200).json({
        eventRequests: result.eventRequests,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        currentPage: result.currentPage,
      });
    } catch (err: any) {
      console.error(`Error in getEventRequests:`, err);
      res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
        statusCode: 500,
      });
    }
  }

  async approveEventRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`Received POST /api/admin/events/requests/${id}/approve`);

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Invalid event request ID",
          statusCode: 400,
        });
      }

      await approveEventRequest.execute(id);
      res.status(200).json({ message: "Event request approved successfully" });
    } catch (err: any) {
      console.error(`Error in approveEventRequest:`, err);
      res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
        statusCode: 500,
      });
    }
  }

  async rejectEventRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Invalid event request ID",
          statusCode: 400,
        });
      }


      await rejectEventRequest.execute({ id });
      res.status(200).json({ message: "Event request rejected successfully" });
    } catch (err: any) {
      console.error(`Error in rejectEventRequest:`, err);
      res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
        statusCode: 500,
      });
    }
  }

  async getParticipants(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = "1", limit = "10", status = "all" } = req.query;

      console.log(`Received GET /api/admin/events/participants with filters:`, {
        page,
        limit,
        status,
      });

      if (
        isNaN(Number(page)) ||
        isNaN(Number(limit)) ||
        Number(page) < 1 ||
        Number(limit) < 1
      ) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Invalid page or limit parameters",
          statusCode: 400,
        });
      }

      const result = await getParticipants.execute({
        page: Number(page),
        limit: Number(limit),
        status: String(status),
      });

      res.status(200).json({
        participants: result.participants,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        currentPage: result.currentPage,
      });
    } catch (err: any) {
      console.error(`Error in getParticipants:`, err);
      res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
        statusCode: 500,
      });
    }
  }

  async approveParticipant(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`Received POST /api/admin/events/participants/${id}/approve`);

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Invalid participant ID",
          statusCode: 400,
        });
      }

      await approveParticipant.execute(id);
      res.status(200).json({ message: "Participant approved successfully" });
    } catch (err: any) {
      console.error(`Error in approveParticipant:`, err);
      res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
        statusCode: 500,
      });
    }
  }

  async rejectParticipant(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      console.log(
        `Received POST /api/admin/events/participants/${id}/reject with reason:`,
        reason
      );

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Invalid participant ID",
          statusCode: 400,
        });
      }
      if (!reason) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Reason is required for rejection",
          statusCode: 400,
        });
      }

      await rejectParticipant.execute({ id, reason });
      res.status(200).json({ message: "Participant rejected successfully" });
    } catch (err: any) {
      console.error(`Error in rejectParticipant:`, err);
      res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
        statusCode: 500,
      });
    }
  }

  async deleteParticipant(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`Received DELETE /api/admin/events/participants/${id}`);

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Invalid participant ID",
          statusCode: 400,
        });
      }

      await deleteParticipant.execute(id);
      res.status(200).json({ message: "Participant deleted successfully" });
    } catch (err: any) {
      console.error(`Error in deleteParticipant:`, err);
      res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
        statusCode: 500,
      });
    }
  }
}

export const eventsController = new EventsController();
