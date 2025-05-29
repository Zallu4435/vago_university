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
import { getEventRequestDetails } from "../../application/use-cases/events/getEventRequestDetails";

class EventsController {
  async getEvents(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      page = "1",
      limit = "10",
      type = "all",
      status = "all",
      startDate,
      endDate,
    } = req.query;

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

    // Validate date parameters if provided
    if (startDate && isNaN(Date.parse(String(startDate)))) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid startDate format",
        statusCode: 400,
      });
    }
    if (endDate && isNaN(Date.parse(String(endDate)))) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid endDate format",
        statusCode: 400,
      });
    }

    const result = await getEvents.execute({
      page: Number(page),
      limit: Number(limit),
      type: String(type),
      status: String(status),
      startDate: startDate ? new Date(String(startDate)) : undefined,
      endDate: endDate ? new Date(String(endDate)) : undefined,
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
      startDate,
      endDate,
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

    // Validate date parameters if provided
    if (startDate && isNaN(Date.parse(String(startDate)))) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid startDate format",
        statusCode: 400,
      });
    }
    if (endDate && isNaN(Date.parse(String(endDate)))) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid endDate format",
        statusCode: 400,
      });
    }

    const result = await getEventRequests.execute({
      page: pageNumber,
      limit: limitNumber,
      type: String(type),
      status: String(status),
      startDate: startDate ? new Date(String(startDate)) : undefined,
      endDate: endDate ? new Date(String(endDate)) : undefined,
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

  async getEventRequestDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid event request ID',
          statusCode: 400,
        });
      }

      const eventRequest = await getEventRequestDetails.execute(id);
      res.status(200).json({ data: eventRequest });
    } catch (err: any) {
      console.error(`Error in getEventRequestDetails:`, err);
      res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        statusCode: 500,
      });
    }
  }
}

export const eventsController = new EventsController();
