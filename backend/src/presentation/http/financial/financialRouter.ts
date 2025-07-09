import express from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";
import { getFinancialComposer } from "../../../infrastructure/services/financial/FinancialComposers";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const financialController = getFinancialComposer();

// Student Routes
router.get(
  "/student-info",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.getStudentFinancialInfo.bind(financialController))
);
router.post(
  "/payments",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.makePayment.bind(financialController))
);
router.get(
  "/financial-aid",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.getFinancialAidApplications.bind(financialController))
);
router.post(
  "/financial-aid",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.applyForFinancialAid.bind(financialController))
);
router.get(
  "/scholarships",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.getAvailableScholarships.bind(financialController))
);
router.get(
  "/scholarship-applications",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.getScholarshipApplications.bind(financialController))
);
router.post(
  "/scholarship-applications",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.applyForScholarship.bind(financialController))
);
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  (req, res, next) => expressAdapter(req, res, next, financialController.uploadDocument.bind(financialController))
);
router.get(
  "/payments/:paymentId/receipt",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.getPaymentReceipt.bind(financialController))
);
router.patch(
  "/financial-aid/:applicationId",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.updateFinancialAidApplication.bind(financialController))
);
router.patch(
  "/scholarship-applications/:applicationId",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.updateScholarshipApplication.bind(financialController))
);

// Admin Routes
router.get(
  "/admin/payments",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.getAllPayments.bind(financialController))
);
router.get(
  "/admin/payments/:id",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.getOnePayment.bind(financialController))
);
router.get(
  "/admin/financial-aid",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.getAllFinancialAidApplications.bind(financialController))
);
router.get(
  "/admin/scholarship-applications",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.getAllScholarshipApplications.bind(financialController))
);
router.get(
  "/admin/charges",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.getAllCharges.bind(financialController))
);
router.post(
  "/admin/charges",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.createCharge.bind(financialController))
);

export default router;