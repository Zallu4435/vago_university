import { Router } from "express";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getNotificationComposer } from "../../../infrastructure/services/notifications/NotificationComposers";

const notificationRouter = Router();
const notificationController = getNotificationComposer();

notificationRouter.post(
  "/",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, notificationController.createNotification.bind(notificationController))
);

notificationRouter.get(
  "/",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, notificationController.getAllNotifications.bind(notificationController))
);

notificationRouter.get(
  "/:notificationId",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, notificationController.getIndividualNotification.bind(notificationController))
);

notificationRouter.delete(
  "/:notificationId",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, notificationController.deleteNotification.bind(notificationController))
);

notificationRouter.patch(
  "/:notificationId/read",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, notificationController.markNotificationAsRead.bind(notificationController))
);

notificationRouter.patch(
  "/read-all",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, notificationController.markAllNotificationsAsRead.bind(notificationController))
);

export default notificationRouter;