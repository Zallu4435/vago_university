import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getFacultyComposer } from "../../../infrastructure/services/faculty/FacultyComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const facultyRouter = Router();
const facultyController = getFacultyComposer();

// Public routes (no auth required)
facultyRouter.post(
  "/:id/confirm/:action",
  (req, res, next) => expressAdapter(req, res, facultyController.confirmFacultyOffer.bind(facultyController))
);

// Protected routes (auth required)
facultyRouter.get("/", authMiddleware, (req, res, next) => expressAdapter(req, res, facultyController.getFaculty.bind(facultyController)));

facultyRouter.get("/:id", authMiddleware, (req, res, next) => expressAdapter(req, res, facultyController.getFacultyById.bind(facultyController)));

facultyRouter.post("/:id/approve", authMiddleware, (req, res, next) => expressAdapter(req, res, facultyController.approveFaculty.bind(facultyController)));

facultyRouter.post("/:id/reject", authMiddleware, (req, res, next) => expressAdapter(req, res, facultyController.rejectFaculty.bind(facultyController)));

facultyRouter.delete("/:id", authMiddleware, (req, res, next) => expressAdapter(req, res, facultyController.deleteFaculty.bind(facultyController)));

facultyRouter.get(
  "/:facultyId/document",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, facultyController.downloadCertificate.bind(facultyController))
);

// Faculty document serve route
facultyRouter.get(
  "/:facultyId/documents",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, facultyController.serveDocument.bind(facultyController))
);

export default facultyRouter;