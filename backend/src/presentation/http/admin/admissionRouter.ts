import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getAdminAdmissionsComposer } from "../../../infrastructure/services/admin/AdmissionComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const admissionRouter = Router();
const admissionController = getAdminAdmissionsComposer();

admissionRouter.post(
    "/:id/confirm/:action",
    (req, res, next) => {
        expressAdapter(req, res, next, admissionController.confirmAdmissionOffer.bind(admissionController));
    }
);

admissionRouter.get(
    "/:id/token",
    (req, res, next) => {
        expressAdapter(req, res, next, admissionController.getAdmissionByToken.bind(admissionController));
    }
);

// Protected routes (auth required)
admissionRouter.get("/", authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, admissionController.getAdmissions.bind(admissionController));
});

admissionRouter.get("/:id", authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, admissionController.getAdmissionById.bind(admissionController));
});

admissionRouter.post("/:id/approve", authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, admissionController.approveAdmission.bind(admissionController));
});

admissionRouter.post("/:id/reject", authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, admissionController.rejectAdmission.bind(admissionController));
});

admissionRouter.post("/:id/block", authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, admissionController.blockAdmission.bind(admissionController));
});

admissionRouter.delete("/:id", authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, admissionController.deleteAdmission.bind(admissionController));
});

// Admin document serve route
admissionRouter.get("/documents/:documentId", authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, admissionController.serveDocument.bind(admissionController));
});

export default admissionRouter;