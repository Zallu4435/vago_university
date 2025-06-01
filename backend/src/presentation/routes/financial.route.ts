import express from 'express';
import { financialController } from '../controllers/financialController';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Student Routes
router.get('/charges', authMiddleware, financialController.getCurrentCharges);
router.get('/payments', authMiddleware, financialController.getPaymentHistory);
router.post('/payments', authMiddleware, financialController.makePayment);
router.get('/financial-aid', authMiddleware, financialController.getFinancialAidApplications);
router.post('/financial-aid', authMiddleware, financialController.applyForFinancialAid);
router.get('/scholarships', authMiddleware, financialController.getAvailableScholarships);
router.get('/scholarship-applications', authMiddleware, financialController.getScholarshipApplications);
router.post('/scholarship-applications', authMiddleware, financialController.applyForScholarship);
router.post('/upload', authMiddleware, upload.single('file'), financialController.uploadDocument);
router.get('/payments/:paymentId/receipt', authMiddleware, financialController.getPaymentReceipt);
router.patch('/financial-aid/:applicationId', authMiddleware, financialController.updateFinancialAidApplication);
router.patch('/scholarship-applications/:applicationId', authMiddleware, financialController.updateScholarshipApplication);

// Admin Routes
router.get('/admin/payments', authMiddleware, financialController.getAllPayments);
router.get('/admin/payments/:id', authMiddleware, financialController.getOnePayment);
router.get('/admin/financial-aid', authMiddleware, financialController.getAllFinancialAidApplications);
router.get('/admin/scholarship-applications', authMiddleware, financialController.getAllScholarshipApplications);
router.get('/admin/charges', authMiddleware, financialController.getAllCharges);
router.post('/admin/charges', authMiddleware, financialController.createCharge); 

router.get('/student-info', authMiddleware, financialController.getStudentFinancialInfo);


export default router;