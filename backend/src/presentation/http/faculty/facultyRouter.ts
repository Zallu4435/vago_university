import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getFacultyComposer } from "../../../infrastructure/services/faculty/FacultyComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const facultyRouter = Router();
const facultyController = getFacultyComposer();

// Public routes (no auth required)
facultyRouter.post(
  "/:id/confirm/:action",
  async (req, res, next) => {
    await expressAdapter(req, res, facultyController.confirmFacultyOffer.bind(facultyController));
  }
);

facultyRouter.get(
  "/:id/token",
  async (req, res, next) => {
    await expressAdapter(req, res, facultyController.getFacultyByToken.bind(facultyController));
  }
);

// Protected routes (auth required)
facultyRouter.get("/", authMiddleware, async (req, res, next) => {
  await expressAdapter(req, res, facultyController.getFaculty.bind(facultyController));
});

facultyRouter.get("/:id", authMiddleware, async (req, res, next) => {
  await expressAdapter(req, res, facultyController.getFacultyById.bind(facultyController));
});

facultyRouter.post("/:id/approve", authMiddleware, async (req, res, next) => {
  await expressAdapter(req, res, facultyController.approveFaculty.bind(facultyController));
});

facultyRouter.post("/:id/reject", authMiddleware, async (req, res, next) => {
  await expressAdapter(req, res, facultyController.rejectFaculty.bind(facultyController));
});

facultyRouter.delete("/:id", authMiddleware, async (req, res, next) => {
  await expressAdapter(req, res, facultyController.deleteFaculty.bind(facultyController));
});

facultyRouter.get(
  "/:facultyId/document",
  authMiddleware,
  async (req, res, next) => {
    await expressAdapter(req, res, facultyController.downloadCertificate.bind(facultyController));
  }
);

// Faculty document serve route
facultyRouter.get(
  "/:facultyId/documents",
  authMiddleware,
  async (req, res, next) => {
    await expressAdapter(req, res, facultyController.serveDocument.bind(facultyController));
  }
);

export default facultyRouter;