// backend/src/controllers/admissionController.ts
import { Request, Response, NextFunction } from 'express';
import { getAdmissions } from '../../application/use-cases/user/getAdmission';
import { getAdmissionById } from '../../application/use-cases/user/getAdmissionById';
import { approveAdmission } from '../../application/use-cases/user/approveAdmission';
import { rejectAdmission } from '../../application/use-cases/user/rejectAdmission';
import { deleteAdmission } from '../../application/use-cases/user/deleteAdmission';
import { confirmAdmissionOffer } from '../../application/use-cases/user/confirmAdmissionOffer';

class AdmissionController {
  async getAdmissions(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = 1,
        limit = 5,
        status = 'all',
        program = 'all',
        dateRange = 'all',
        startDate,
        endDate,
      } = req.query;

      console.log(`Received GET /api/admin/admissions with filters:`, {
        page,
        limit,
        status,
        program,
        dateRange,
        startDate,
        endDate,
      });

      const result = await getAdmissions.execute({
        page: Number(page),
        limit: Number(limit),
        status: String(status),
        program: String(program),
        dateRange: String(dateRange),
        startDate: startDate ? String(startDate) : undefined,
        endDate: endDate ? String(endDate) : undefined,
      });

      res.status(200).json({
        admissions: result.admissions,
        totalAdmissions: result.totalAdmissions,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
      });
    } catch (err) {
      console.error(`Error in getAdmissions:`, err);
      next(err);
    }
  }

  async getAdmissionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`Received GET /api/admin/admissions/${id}`);

      const admission = await getAdmissionById.execute(id);

      if (!admission) {
        return res.status(404).json({ error: 'Admission not found' });
      }

      res.status(200).json(admission);
    } catch (err) {
      console.error(`Error in getAdmissionById:`, err);
      next(err);
    }
  }

  async approveAdmission(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(req.body, "body")
      const { programDetails, startDate, scholarshipInfo, additionalNotes } = req.body;
      
      console.log(`Received POST /api/admin/admissions/${id}/approve with details:`, {
        programDetails,
        startDate,
        scholarshipInfo,
        additionalNotes
      });

      await approveAdmission.execute({
        id,
        additionalInfo: {
          programDetails,
          startDate,
          scholarshipInfo,
          additionalNotes
        }
      });

      res.status(200).json({ message: 'Admission offer email sent' });
    } catch (err) {
      console.error(`Error in approveAdmission:`, err);
      next(err);
    }
  }
  
  async rejectAdmission(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`Received POST /api/admin/admissions/${id}/reject`);

      await rejectAdmission.execute(id);

      res.status(200).json({ message: 'Admission rejected' });
    } catch (err) {
      console.error(`Error in rejectAdmission:`, err);
      next(err);
    }
  }

  async deleteAdmission(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`Received DELETE /api/admin/admissions/${id}`);

      await deleteAdmission.execute(id);

      res.status(200).json({ message: 'Admission deleted' });
    } catch (err) {
      console.error(`Error in deleteAdmission:`, err);
      next(err);
    }
  }
  
  async confirmOffer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, action } = req.params;
      const { token } = req.query;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'Token is required' });
      }
      
      if (action !== 'accept' && action !== 'reject') {
        return res.status(400).json({ error: 'Invalid action' });
      }
      
      console.log(`Received POST /api/admissions/${id}/confirm/${action}`);

      await confirmAdmissionOffer.execute({
        admissionId: id,
        token,
        action: action as 'accept' | 'reject'
      });

      res.status(200).json({ 
        message: action === 'accept' 
          ? 'Admission accepted and user account created' 
          : 'Admission offer rejected'
      });
    } catch (err) {
      console.error(`Error in confirmOffer:`, err);
      next(err);
    }
  }
}

export const admissionController = new AdmissionController();