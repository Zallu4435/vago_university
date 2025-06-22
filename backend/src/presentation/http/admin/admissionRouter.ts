import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getAdminAdmissionsComposer } from "../../../infrastructure/services/admin/AdmissionComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const admissionRouter = Router();
const admissionController = getAdminAdmissionsComposer();

// Public routes (no auth required)
admissionRouter.post(
    "/:id/confirm/:action",
    async (req, res, next) => {
        await expressAdapter(req, res, admissionController.confirmAdmissionOffer.bind(admissionController));
    }
);

admissionRouter.get(
    "/:id/token",
    async (req, res, next) => {
        await expressAdapter(req, res, admissionController.getAdmissionByToken.bind(admissionController));
    }
);

// Protected routes (auth required)
admissionRouter.get("/", authMiddleware, async (req, res, next) => {
    await expressAdapter(req, res, admissionController.getAdmissions.bind(admissionController));
});

admissionRouter.get("/:id", authMiddleware, async (req, res, next) => {
    await expressAdapter(req, res, admissionController.getAdmissionById.bind(admissionController));
});

admissionRouter.post("/:id/approve", authMiddleware, async (req, res, next) => {
    await expressAdapter(req, res, admissionController.approveAdmission.bind(admissionController));
});

admissionRouter.post("/:id/reject", authMiddleware, async (req, res, next) => {
    await expressAdapter(req, res, admissionController.rejectAdmission.bind(admissionController));
});

admissionRouter.delete("/:id", authMiddleware, async (req, res, next) => {
    await expressAdapter(req, res, admissionController.deleteAdmission.bind(admissionController));
});

// Admin document serve route
admissionRouter.get("/documents/:documentId", authMiddleware, async (req, res, next) => {
    await expressAdapter(req, res, admissionController.serveDocument.bind(admissionController));
});

export default admissionRouter;