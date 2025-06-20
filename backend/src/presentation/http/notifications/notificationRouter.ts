import { Router } from "express";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getNotificationComposer } from "../../../infrastructure/services/notifications/NotificationComposers";

const notificationRouter = Router();
const notificationController = getNotificationComposer();

notificationRouter.post(
  "/",
  authMiddleware,
  (req, res, next) => { expressAdapter(req, res, notificationController.createNotification.bind(notificationController)).catch(next); }
);

notificationRouter.get(
  "/",
  authMiddleware,
  (req, res, next) => { expressAdapter(req, res, notificationController.getAllNotifications.bind(notificationController)).catch(next); }
);

notificationRouter.get(
  "/:notificationId",
  authMiddleware,
  (req, res, next) => { expressAdapter(req, res, notificationController.getIndividualNotification.bind(notificationController)).catch(next); }
);

notificationRouter.delete(
  "/:notificationId",
  authMiddleware,
  (req, res, next) => { expressAdapter(req, res, notificationController.deleteNotification.bind(notificationController)).catch(next); }
);

export default notificationRouter;