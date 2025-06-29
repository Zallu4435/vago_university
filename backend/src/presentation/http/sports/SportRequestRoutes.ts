import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getSportRequestsComposer } from "../../../infrastructure/services/sports/SportRequestComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const sportRequestRouter = Router();
const sportRequestController = getSportRequestsComposer();

// Get all sport requests (with pagination and filters)
sportRequestRouter.get(
  "/",
  authMiddleware,
  (req, res) => expressAdapter(req, res, sportRequestController.getSportRequests.bind(sportRequestController))
);

// Get sport request details
sportRequestRouter.get(
  "/:id",
  authMiddleware,
  (req, res) => expressAdapter(req, res, sportRequestController.getSportRequestDetails.bind(sportRequestController))
);

// Approve sport request
sportRequestRouter.post(
  "/:id/approve",
  authMiddleware,
  (req, res) => expressAdapter(req, res, sportRequestController.approveSportRequest.bind(sportRequestController))
);

// Reject sport request
sportRequestRouter.post(
  "/:id/reject",
  authMiddleware,
  (req, res) => expressAdapter(req, res, sportRequestController.rejectSportRequest.bind(sportRequestController))
);

// Join a sport
sportRequestRouter.post(
  "/join/:sportId",
  authMiddleware,
  (req, res) => expressAdapter(req, res, sportRequestController.joinSport.bind(sportRequestController))
);

export default sportRequestRouter; 