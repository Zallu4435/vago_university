import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getEventsComposer } from "../../../infrastructure/services/events/EventComposers";
import { getEventRequestsComposer } from "../../../infrastructure/services/events/EventRequestComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const eventRouter = Router();
const eventController = getEventsComposer();
const eventRequestController = getEventRequestsComposer();

eventRouter.get("/requests", authMiddleware, (req, res) =>
  expressAdapter(
    req,
    res,
    eventRequestController.getEventRequests.bind(eventRequestController)
  )
);
eventRouter.post("/requests/:id/approve", authMiddleware, (req, res) =>
  expressAdapter(
    req,
    res,
    eventRequestController.approveEventRequest.bind(eventRequestController)
  )
);
eventRouter.post("/requests/:id/reject", authMiddleware, (req, res) =>
  expressAdapter(
    req,
    res,
    eventRequestController.rejectEventRequest.bind(eventRequestController)
  )
);
eventRouter.get("/requests/:id", authMiddleware, (req, res) =>
  expressAdapter(
    req,
    res,
    eventRequestController.getEventRequestDetails.bind(eventRequestController)
  )
);

eventRouter.get("/", authMiddleware, (req, res) =>
  expressAdapter(req, res, eventController.getEvents.bind(eventController))
);
eventRouter.get("/:id", authMiddleware, (req, res) =>
  expressAdapter(req, res, eventController.getEventById.bind(eventController))
);
eventRouter.post("/", authMiddleware, (req, res) =>
  expressAdapter(req, res, eventController.createEvent.bind(eventController))
);
eventRouter.put("/:id", authMiddleware, (req, res) =>
  expressAdapter(req, res, eventController.updateEvent.bind(eventController))
);
eventRouter.delete("/:id", authMiddleware, (req, res) =>
  expressAdapter(req, res, eventController.deleteEvent.bind(eventController))
);


export default eventRouter;
