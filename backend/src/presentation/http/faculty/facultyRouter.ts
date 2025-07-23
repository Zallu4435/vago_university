import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getFacultyComposer } from "../../../infrastructure/services/faculty/FacultyComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const facultyRouter = Router();
const facultyController = getFacultyComposer();

facultyRouter.post(
  "/:id/confirm/:action",
  async (req, res, next) => {
    await expressAdapter(req, res, next, facultyController.confirmFacultyOffer.bind(facultyController));
  }
);

facultyRouter.get(
  "/:id/token",
  async (req, res, next) => {
    await expressAdapter(req, res, next, facultyController.getFacultyByToken.bind(facultyController));
  }
);

facultyRouter.get("/", authMiddleware, async (req, res, next) => {
  await expressAdapter(req, res, next, facultyController.getFaculty.bind(facultyController));
});

facultyRouter.get("/:id", authMiddleware, async (req, res, next) => {
  await expressAdapter(req, res, next, facultyController.getFacultyById.bind(facultyController));
});

facultyRouter.post("/:id/approve", authMiddleware, async (req, res, next) => {
  await expressAdapter(req, res, next, facultyController.approveFaculty.bind(facultyController));
});

facultyRouter.post("/:id/reject", authMiddleware, async (req, res, next) => {
  await expressAdapter(req, res, next, facultyController.rejectFaculty.bind(facultyController));
});

facultyRouter.post("/:id/block", authMiddleware, async (req, res, next) => {
  await expressAdapter(req, res, next, facultyController.blockFaculty.bind(facultyController));
});

facultyRouter.delete("/:id", authMiddleware, async (req, res, next) => {
  await expressAdapter(req, res, next, facultyController.deleteFaculty.bind(facultyController));
});

facultyRouter.get(
  "/:facultyId/document",
  authMiddleware,
  async (req, res, next) => {
    await expressAdapter(req, res, next, facultyController.downloadCertificate.bind(facultyController));
  }
);

facultyRouter.get(
  "/:facultyId/documents",
  authMiddleware,
  async (req, res, next) => {
    await expressAdapter(req, res, next, facultyController.serveDocument.bind(facultyController));
  }
);

export default facultyRouter;