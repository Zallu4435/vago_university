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
router.post(
  "/check-pending",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.checkPendingPayment.bind(financialController))
);
router.post(
  "/clear-pending",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.clearPendingPayment.bind(financialController))
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
  "/admin/charges",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.getAllCharges.bind(financialController))
);
router.post(
  "/admin/charges",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.createCharge.bind(financialController))
);
router.patch(
  '/admin/charges/:id',
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.updateCharge.bind(financialController))
);
router.delete(
  '/admin/charges/:id',
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, next, financialController.deleteCharge.bind(financialController))
);

export default router;