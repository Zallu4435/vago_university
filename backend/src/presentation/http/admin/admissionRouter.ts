import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getAdminAdmissionsComposer } from "../../../infrastructure/services/admin/AdmissionComposers";

const admissionRouter = Router();
const admissionController = getAdminAdmissionsComposer();


admissionRouter.get("/", (req, res, next) => expressAdapter(req, res, admissionController.getAdmissions.bind(admissionController)));

admissionRouter.get("/:id", (req, res, next) => expressAdapter(req, res, admissionController.getAdmissionById.bind(admissionController)));

admissionRouter.post("/:id/approve", (req, res, next) => expressAdapter(req, res, admissionController.approveAdmission.bind(admissionController)));

admissionRouter.post("/:id/reject", (req, res, next) => expressAdapter(req, res, admissionController.rejectAdmission.bind(admissionController)));

admissionRouter.delete("/:id", (req, res, next) => expressAdapter(req, res, admissionController.deleteAdmission.bind(admissionController)));

admissionRouter.post(
    "/:id/confirm/:action",
    (req, res, next) => expressAdapter(req, res, admissionController.confirmAdmissionOffer.bind(admissionController))
);

export default admissionRouter;