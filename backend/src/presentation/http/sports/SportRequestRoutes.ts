import { Router } from "express";
import { ISportRequestController } from "../../IHttp";
import { authMiddleware } from "../../middlewares/authMiddleware";

export const createSportRequestRoutes = (controller: ISportRequestController) => {
  const router = Router();

  // Get all sport requests (with pagination and filters)
  router.get(
    "/",
    authMiddleware,
    controller.getSportRequests.bind(controller)
  );

  // Get sport request details
  router.get(
    "/:id",
    authMiddleware,
    controller.getSportRequestDetails.bind(controller)
  );

  // Approve sport request
  router.post(
    "/:id/approve",
    authMiddleware,
    controller.approveSportRequest.bind(controller)
  );

  // Reject sport request
  router.post(
    "/:id/reject",
    authMiddleware,
    controller.rejectSportRequest.bind(controller)
  );

  // Join a sport
  router.post(
    "/join/:sportId",
    authMiddleware,
    controller.joinSport.bind(controller)
  );

  return router;
}; 