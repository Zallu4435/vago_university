import { Request, Response, NextFunction } from 'express';
import {
  getStudentFinancialInfo,
  getCurrentCharges,
  getPaymentHistory,
  getAllPayments,
  makePayment,
  getFinancialAidApplications,
  getAllFinancialAidApplications,
  applyForFinancialAid,
  getAvailableScholarships,
  getScholarshipApplications,
  getAllScholarshipApplications,
  applyForScholarship,
  uploadDocument,
  getPaymentReceipt,
  updateFinancialAidApplication,
  updateScholarshipApplication,
} from '../../application/use-cases/financial/financial.useCases';

export class FinancialController {
  async getStudentFinancialInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error('User ID not found');
      const info = await getStudentFinancialInfo.execute(studentId);
      res.status(200).json({ data: info });
    } catch (err) {
      next(err);
    }
  }

  async getCurrentCharges(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error('User ID not found');
      const { term } = req.query;
      const charges = await getCurrentCharges.execute(studentId, term as string);
      res.status(200).json({ data: charges });
    } catch (err) {
      next(err);
    }
  }

  async getPaymentHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error('User ID not found');
      const { startDate, endDate, status } = req.query;
      const payments = await getPaymentHistory.execute(studentId, {
        startDate: startDate as string,
        endDate: endDate as string,
        status: status as 'Completed' | 'Pending' | 'Failed',
      });
      res.status(200).json({ data: payments });
    } catch (err) {
      next(err);
    }
  }

  async getAllPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate, status, page = '1', limit = '10' } = req.query;
      const result = await getAllPayments.execute({
        startDate: startDate as string,
        endDate: endDate as string,
        status: status as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });
      res.status(200).json({ data: result.data, totalPages: Math.ceil(result.total / parseInt(limit as string)) });
    } catch (err) {
      next(err);
    }
  }

  async makePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error('User ID not found');
      const { amount, method, term } = req.body;
      const payment = await makePayment.execute(studentId, { amount, method, term });
      res.status(201).json({ data: payment });
    } catch (err) {
      next(err);
    }
  }

  async getFinancialAidApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error('User ID not found');
      const { status } = req.query;
      const applications = await getFinancialAidApplications.execute(studentId, status as 'Approved' | 'Pending' | 'Rejected');
      res.status(200).json({ data: applications });
    } catch (err) {
      next(err);
    }
  }

  async getAllFinancialAidApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, term, page = '1', limit = '10' } = req.query;
      const result = await getAllFinancialAidApplications.execute({
        status: status as string,
        term: term as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });
      res.status(200).json({ data: result.data, totalPages: Math.ceil(result.total / parseInt(limit as string)) });
    } catch (err) {
      next(err);
    }
  }

  async applyForFinancialAid(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error('User ID not found');
      const { term, amount, type, documents } = req.body;
      const application = await applyForFinancialAid.execute(studentId, { term, amount, type, documents });
      res.status(201).json({ data: application });
    } catch (err) {
      next(err);
    }
  }

  async getAvailableScholarships(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, term } = req.query;
      const scholarships = await getAvailableScholarships.execute({ status: status as 'Open' | 'Closed', term: term as string });
      res.status(200).json({ data: scholarships });
    } catch (err) {
      next(err);
    }
  }

  async getScholarshipApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error('User ID not found');
      const { status } = req.query;
      const applications = await getScholarshipApplications.execute(studentId, status as 'Approved' | 'Pending' | 'Rejected');
      res.status(200).json({ data: applications });
    } catch (err) {
      next(err);
    }
  }

  async getAllScholarshipApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, page = '1', limit = '10' } = req.query;
      const result = await getAllScholarshipApplications.execute({
        status: status as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });
      res.status(200).json({ data: result.data, totalPages: Math.ceil(result.total / parseInt(limit as string)) });
    } catch (err) {
      next(err);
    }
  }

  async applyForScholarship(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error('User ID not found');
      const { scholarshipId, documents } = req.body;
      const application = await applyForScholarship.execute(studentId, { scholarshipId, documents });
      res.status(201).json({ data: application });
    } catch (err) {
      next(err);
    }
  }

  async uploadDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file;
      const { type } = req.body;
      if (!file) throw new Error('File is required');
      const result = await uploadDocument.execute(file, type as 'financial-aid' | 'scholarship');
      res.status(201).json({ data: result });
    } catch (err) {
      next(err);
    }
  }

  async getPaymentReceipt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error('User ID not found');
      const { paymentId } = req.params;
      const receipt = await getPaymentReceipt.execute(studentId, paymentId);
      res.status(200).json({ data: receipt });
    } catch (err) {
      next(err);
    }
  }

  async updateFinancialAidApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error('User ID not found');
      const { applicationId } = req.params;
      const { status, amount } = req.body;
      const application = await updateFinancialAidApplication.execute(studentId, applicationId, { status, amount });
      res.status(200).json({ data: application });
    } catch (err) {
      next(err);
    }
  }

  async updateScholarshipApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error('User ID not found');
      const { applicationId } = req.params;
      const { status } = req.body;
      const application = await updateScholarshipApplication.execute(studentId, applicationId, { status });
      res.status(200).json({ data: application });
    } catch (err) {
      next(err);
    }
  }
}

export const financialController = new FinancialController();