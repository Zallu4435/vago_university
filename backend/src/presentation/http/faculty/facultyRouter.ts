import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getFacultyComposer } from "../../../infrastructure/services/faculty/FacultyComposers";

const facultyRouter = Router();
const facultyController = getFacultyComposer();

facultyRouter.get("/", (req, res, next) => expressAdapter(req, res, facultyController.getFaculty.bind(facultyController)));

facultyRouter.get("/:id", (req, res, next) => expressAdapter(req, res, facultyController.getFacultyById.bind(facultyController)));

facultyRouter.post("/:id/approve", (req, res, next) => expressAdapter(req, res, facultyController.approveFaculty.bind(facultyController)));

facultyRouter.post("/:id/reject", (req, res, next) => expressAdapter(req, res, facultyController.rejectFaculty.bind(facultyController)));

facultyRouter.delete("/:id", (req, res, next) => expressAdapter(req, res, facultyController.deleteFaculty.bind(facultyController)));

facultyRouter.post(
  "/:id/confirm/:action",
  (req, res, next) => expressAdapter(req, res, facultyController.confirmFacultyOffer.bind(facultyController))
);

facultyRouter.get(
  "/:facultyId/document",
  (req, res, next) => expressAdapter(req, res, facultyController.downloadCertificate.bind(facultyController))
);

export default facultyRouter;