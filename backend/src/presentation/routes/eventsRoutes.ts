import { Router } from "express";
import { eventsController } from "../controllers/eventsController";
import { authMiddleware } from "../../shared/middlewares/authMiddleware";

const router = Router();

router.get("/requests", authMiddleware, eventsController.getEventRequests);
router.get(
  "/requests/:id",
  authMiddleware,
  eventsController.getEventRequestDetails
);
router.post(
  "/requests/:id/approve",
  authMiddleware,
  eventsController.approveEventRequest
);
router.post(
  "/requests/:id/reject",
  authMiddleware,
  eventsController.rejectEventRequest
);


router.get("/", authMiddleware, eventsController.getEvents);
router.get("/:id", authMiddleware, eventsController.getEventById);
router.post("/", authMiddleware, eventsController.createEvent);
router.put("/:id", authMiddleware, eventsController.updateEvent);
router.delete("/:id", authMiddleware, eventsController.deleteEvent);

export default router;
