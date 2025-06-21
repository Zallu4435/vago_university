import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getAdmissionsComposer } from "../../../infrastructure/services/admission/AdmissionComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";
import { admissionDocumentUpload } from "../../../config/cloudinary.config";

const admissionRouter = Router();
const admissionController = getAdmissionsComposer();

admissionRouter.post("/applications", authMiddleware, (req, res) =>
  expressAdapter(req, res, admissionController.createApplication.bind(admissionController))
);

admissionRouter.get("/applications/user/:userId", authMiddleware, (req, res) =>
  expressAdapter(req, res, admissionController.getApplication.bind(admissionController))
);

admissionRouter.post("/applications/:applicationId/sections/:section", authMiddleware, (req, res) =>
  expressAdapter(req, res, admissionController.saveSection.bind(admissionController))
);

admissionRouter.post("/payment/process", authMiddleware, (req, res) =>
  expressAdapter(req, res, admissionController.processPayment.bind(admissionController))
);

admissionRouter.post("/payment/confirm", authMiddleware, (req, res) =>
  expressAdapter(req, res, admissionController.confirmPayment.bind(admissionController))
);

admissionRouter.post("/finalize", authMiddleware, (req, res) =>
  expressAdapter(req, res, admissionController.handleFinalSubmit.bind(admissionController))
);

// Document upload routes
admissionRouter.post("/documents/upload", authMiddleware, admissionDocumentUpload.single('file'), (req, res) =>
  expressAdapter(req, res, admissionController.uploadDocument.bind(admissionController))
);

admissionRouter.post("/documents/upload-multiple", authMiddleware, admissionDocumentUpload.array('files', 10), (req, res) =>
  expressAdapter(req, res, admissionController.uploadMultipleDocuments.bind(admissionController))
);

// Document serve route
admissionRouter.get("/documents/:documentId", authMiddleware, (req, res) =>
  expressAdapter(req, res, admissionController.serveDocument.bind(admissionController))
);

export default admissionRouter;