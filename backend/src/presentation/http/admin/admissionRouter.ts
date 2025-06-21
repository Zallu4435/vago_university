import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getAdminAdmissionsComposer } from "../../../infrastructure/services/admin/AdmissionComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const admissionRouter = Router();
const admissionController = getAdminAdmissionsComposer();


admissionRouter.get("/", authMiddleware, (req, res, next) => expressAdapter(req, res, admissionController.getAdmissions.bind(admissionController)));

admissionRouter.get("/:id", authMiddleware, (req, res, next) => expressAdapter(req, res, admissionController.getAdmissionById.bind(admissionController)));

admissionRouter.post("/:id/approve", authMiddleware, (req, res, next) => expressAdapter(req, res, admissionController.approveAdmission.bind(admissionController)));

admissionRouter.post("/:id/reject", authMiddleware, (req, res, next) => expressAdapter(req, res, admissionController.rejectAdmission.bind(admissionController)));

admissionRouter.delete("/:id", authMiddleware, (req, res, next) => expressAdapter(req, res, admissionController.deleteAdmission.bind(admissionController)));

admissionRouter.post(
    "/:id/confirm/:action",
    (req, res, next) => expressAdapter(req, res, admissionController.confirmAdmissionOffer.bind(admissionController))
);

// Admin document serve route
admissionRouter.get("/documents/:documentId", authMiddleware, (req, res) =>
  expressAdapter(req, res, admissionController.serveDocument.bind(admissionController))
);

export default admissionRouter;