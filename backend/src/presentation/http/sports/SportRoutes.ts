import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getSportsComposer } from "../../../infrastructure/services/sports/SportComposers";
import { getSportRequestsComposer } from "../../../infrastructure/services/sports/SportRequestComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

// --- Sport Router ---
const sportRouter = Router();
const sportController = getSportsComposer();

sportRouter.get("/", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, sportController.getSports.bind(sportController))
);
sportRouter.get("/:id", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, sportController.getSportById.bind(sportController))
);
sportRouter.post("/", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, sportController.createSport.bind(sportController))
);
sportRouter.put("/:id", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, sportController.updateSport.bind(sportController))
);
sportRouter.delete("/:id", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, sportController.deleteSport.bind(sportController))
);

// --- Sport Request Router ---
const sportRequestRouter = Router();
const sportRequestController = getSportRequestsComposer();

sportRequestRouter.get("/", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, sportRequestController.getSportRequests.bind(sportRequestController))
);
sportRequestRouter.post("/:id/approve", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, sportRequestController.approveSportRequest.bind(sportRequestController))
);
sportRequestRouter.post("/:id/reject", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, sportRequestController.rejectSportRequest.bind(sportRequestController))
);
sportRequestRouter.get("/:id", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, sportRequestController.getSportRequestDetails.bind(sportRequestController))
);
sportRequestRouter.post("/join", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, sportRequestController.joinSport.bind(sportRequestController))
);

export { sportRouter, sportRequestRouter }; 