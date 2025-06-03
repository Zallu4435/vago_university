import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getClubsComposer } from "../../../infrastructure/services/clubs/ClubComposers";
import { getClubRequestsComposer } from "../../../infrastructure/services/clubs/ClubRequestComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const clubRouter = Router();
const clubController = getClubsComposer();
const clubRequestController = getClubRequestsComposer();

// Club request routes
clubRouter.get("/club-requests", authMiddleware, (req, res) =>
  expressAdapter(
    req,
    res,
    clubRequestController.getClubRequests.bind(clubRequestController)
  )
);
clubRouter.get("/club-requests/:id", authMiddleware, (req, res) =>
  expressAdapter(
    req,
    res,
    clubRequestController.getClubRequestDetails.bind(clubRequestController)
  )
);
clubRouter.post("/club-requests/:id/approve", authMiddleware, (req, res) =>
  expressAdapter(
    req,
    res,
    clubRequestController.approveClubRequest.bind(clubRequestController)
  )
);
clubRouter.post("/club-requests/:id/reject", authMiddleware, (req, res) =>
  expressAdapter(
    req,
    res,
    clubRequestController.rejectClubRequest.bind(clubRequestController)
  )
);

// Club routes
clubRouter.get("/", authMiddleware, (req, res) =>
  expressAdapter(req, res, clubController.getClubs.bind(clubController))
);
clubRouter.get("/:id", authMiddleware, (req, res) =>
  expressAdapter(req, res, clubController.getClubById.bind(clubController))
);
clubRouter.post("/", authMiddleware, (req, res) =>
  expressAdapter(req, res, clubController.createClub.bind(clubController))
);
clubRouter.put("/:id", authMiddleware, (req, res) =>
  expressAdapter(req, res, clubController.updateClub.bind(clubController))
);
clubRouter.delete("/:id", authMiddleware, (req, res) =>
  expressAdapter(req, res, clubController.deleteClub.bind(clubController))
);

export default clubRouter;