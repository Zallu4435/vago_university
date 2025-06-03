import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getSportsComposer } from "../../../infrastructure/services/sports/SportComposers";
import { getSportRequestsComposer } from "../../../infrastructure/services/sports/SportRequestComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const sportRouter = Router();
const sportController = getSportsComposer();
const sportRequestController = getSportRequestsComposer();

// Sport request routes
sportRouter.get("/player-requests", authMiddleware, (req, res) =>
  expressAdapter(
    req,
    res,
    sportRequestController.getSportRequests.bind(sportRequestController)
  )
);

sportRouter.get("/player-requests/:id", authMiddleware, (req, res) =>
  expressAdapter(
    req,
    res,
    sportRequestController.getSportRequestDetails.bind(sportRequestController)
  )
);

sportRouter.post("/player-requests/:id/approve", authMiddleware, (req, res) =>
  expressAdapter(
    req,
    res,
    sportRequestController.approveSportRequest.bind(sportRequestController)
  )
);

sportRouter.post("/player-requests/:id/reject", authMiddleware, (req, res) =>
  expressAdapter(
    req,
    res,
    sportRequestController.rejectSportRequest.bind(sportRequestController)
  )
);

sportRouter.post("/:player-requests/join", authMiddleware, (req, res) =>
  expressAdapter(
    req,
    res,
    sportRequestController.joinSport.bind(sportRequestController)
  )
);

// Sport routes
sportRouter.get("/", authMiddleware, (req, res) =>
  expressAdapter(req, res, sportController.getSports.bind(sportController))
);

sportRouter.get("/:id", authMiddleware, (req, res) =>
  expressAdapter(req, res, sportController.getSportById.bind(sportController))
);

sportRouter.post("/", authMiddleware, (req, res) =>
  expressAdapter(req, res, sportController.createSport.bind(sportController))
);

sportRouter.put("/:id", authMiddleware, (req, res) =>
  expressAdapter(req, res, sportController.updateSport.bind(sportController))
);

sportRouter.delete("/:id", authMiddleware, (req, res) =>
  expressAdapter(req, res, sportController.deleteSport.bind(sportController))
);

export default sportRouter; 