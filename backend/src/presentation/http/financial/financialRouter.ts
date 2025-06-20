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
  (req, res, next) => { void expressAdapter(req, res, financialController.getStudentFinancialInfo.bind(financialController)); }
);
router.post(
  "/payments",
  authMiddleware,
  (req, res, next) => { void expressAdapter(req, res, financialController.makePayment.bind(financialController)); }
);
router.get(
  "/financial-aid",
  authMiddleware,
  (req, res, next) => { void expressAdapter(req, res, financialController.getFinancialAidApplications.bind(financialController)); }
);
router.post(
  "/financial-aid",
  authMiddleware,
  (req, res, next) => { void expressAdapter(req, res, financialController.applyForFinancialAid.bind(financialController)); }
);
router.get(
  "/scholarships",
  authMiddleware,
  (req, res, next) => { void expressAdapter(req, res, financialController.getAvailableScholarships.bind(financialController)); }
);
router.get(
  "/scholarship-applications",
  authMiddleware,
  (req, res, next) => { void expressAdapter(req, res, financialController.getScholarshipApplications.bind(financialController)); }
);
router.post(
  "/scholarship-applications",
  authMiddleware,
  (req, res, next) => { void expressAdapter(req, res, financialController.applyForScholarship.bind(financialController)); }
);
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  (req, res, next) => { void expressAdapter(req, res, financialController.uploadDocument.bind(financialController)); }
);
router.get(
  "/payments/:paymentId/receipt",
  authMiddleware,
  (req, res, next) => { void expressAdapter(req, res, financialController.getPaymentReceipt.bind(financialController)); }
);
router.patch(
  "/financial-aid/:applicationId",
  authMiddleware,
  (req, res, next) => { void expressAdapter(req, res, financialController.updateFinancialAidApplication.bind(financialController)); }
);
router.patch(
  "/scholarship-applications/:applicationId",
  authMiddleware,
  (req, res, next) => { void expressAdapter(req, res, financialController.updateScholarshipApplication.bind(financialController)); }
);

// Admin Routes
router.get(
  "/admin/payments",
  authMiddleware,
  (req, res, next) => { void expressAdapter(req, res, financialController.getAllPayments.bind(financialController)); }
);
router.get(
  "/admin/payments/:id",
  authMiddleware,
  (req, res, next) => { void expressAdapter(req, res, financialController.getOnePayment.bind(financialController)); }
);
router.get(
  "/admin/financial-aid",
  authMiddleware,
  (req, res, next) => { void expressAdapter(req, res, financialController.getAllFinancialAidApplications.bind(financialController)); }
);
router.get(
  "/admin/scholarship-applications",
  authMiddleware,
  (req, res, next) => { void expressAdapter(req, res, financialController.getAllScholarshipApplications.bind(financialController)); }
);
router.get(
  "/admin/charges",
  authMiddleware,
  (req, res, next) => { void expressAdapter(req, res, financialController.getAllCharges.bind(financialController)); }
);
router.post(
  "/admin/charges",
  authMiddleware,
  (req, res, next) => { void expressAdapter(req, res, financialController.createCharge.bind(financialController)); }
);

export default router;