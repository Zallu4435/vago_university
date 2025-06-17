import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getCampusLifeComposer } from "../../../infrastructure/services/campus-life/CampusLifeComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const campusLifeRouter = Router();
const campusLifeController = getCampusLifeComposer();

campusLifeRouter.use(authMiddleware);

campusLifeRouter.get("/", (req, res) =>
  expressAdapter(req, res, campusLifeController.getCampusLifeOverview.bind(campusLifeController))
);

campusLifeRouter.get("/events", (req, res) =>
  expressAdapter(req, res, campusLifeController.getEvents.bind(campusLifeController))
);

campusLifeRouter.get("/events/:eventId", (req, res) =>
  expressAdapter(req, res, campusLifeController.getEventById.bind(campusLifeController))
);

campusLifeRouter.post("/events/:eventId/join", (req, res) =>
  expressAdapter(req, res, campusLifeController.joinEvent.bind(campusLifeController))
);

campusLifeRouter.get("/sports", (req, res) =>
  expressAdapter(req, res, campusLifeController.getSports.bind(campusLifeController))
);

campusLifeRouter.get("/sports/:sportId", (req, res) =>
  expressAdapter(req, res, campusLifeController.getSportById.bind(campusLifeController))
);

campusLifeRouter.post("/sports/:sportId/join", (req, res) =>
  expressAdapter(req, res, campusLifeController.joinSport.bind(campusLifeController))
);

campusLifeRouter.get("/clubs", (req, res) =>
  expressAdapter(req, res, campusLifeController.getClubs.bind(campusLifeController))
);

campusLifeRouter.get("/clubs/:clubId", (req, res) =>
  expressAdapter(req, res, campusLifeController.getClubById.bind(campusLifeController))
);

campusLifeRouter.post("/clubs/:clubId/join", (req, res) =>
  expressAdapter(req, res, campusLifeController.joinClub.bind(campusLifeController))
);

export default campusLifeRouter;