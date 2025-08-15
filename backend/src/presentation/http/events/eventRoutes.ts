import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getEventsComposer } from "../../../infrastructure/services/events/EventComposers";
import { getEventRequestsComposer } from "../../../infrastructure/services/events/EventRequestComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

// --- Event Router ---
const eventRouter = Router();
const eventController = getEventsComposer();

eventRouter.get("/", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, eventController.getEvents.bind(eventController))
);
eventRouter.get("/:id", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, eventController.getEventById.bind(eventController))
);
eventRouter.post("/", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, eventController.createEvent.bind(eventController))
);
eventRouter.put("/:id", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, eventController.updateEvent.bind(eventController))
);
eventRouter.delete("/:id", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, eventController.deleteEvent.bind(eventController))
);

// --- Event Request Router ---
const eventRequestRouter = Router();
const eventRequestController = getEventRequestsComposer();

eventRequestRouter.get("/", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, eventRequestController.getEventRequests.bind(eventRequestController))
);
eventRequestRouter.post("/:id/approve", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, eventRequestController.approveEventRequest.bind(eventRequestController))
);
eventRequestRouter.post("/:id/reject", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, eventRequestController.rejectEventRequest.bind(eventRequestController))
);
eventRequestRouter.get("/:id", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, eventRequestController.getEventRequestDetails.bind(eventRequestController))
);

export { eventRouter, eventRequestRouter };
