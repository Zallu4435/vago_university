import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { createApplication } from '../../application/use-cases/admission/createApplication';
import { getApplication } from '../../application/use-cases/admission/getApplication';
import { saveSection } from '../../application/use-cases/admission/saveSection';
import { finalizeAdmission } from '../../application/use-cases/admission/finalizeAdmission';
import { processPayment } from '../../application/use-cases/admission/processPayment';
import { AdmissionDraft } from '../../infrastructure/database/mongoose/models/admissionDraft.model';

interface FormData {
  applicationId?: string;
  registerId?: string; // ObjectId as string
  personal?: any;
  choiceOfStudy?: any[];
  education?: any;
  achievements?: any;
  otherInformation?: any;
  documents?: any;
  declaration?: any;
  completedSteps?: string[];
  createdAt?: string;
  updatedAt?: string;
}


class AdmissionController {
  async createApplication(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('createApplication: Request received:', {
        body: req.body,
        headers: req.headers,
      });

      const { userId } = req.body;

      console.log(userId)
      if (!req.user) {
        console.error('createApplication: req.user is undefined');
        return res.status(401).json({ error: 'User authentication required' });
      }
      const { id: registerId } = req.user;
      
      console.log(`createApplication: userId=${userId}, registerId=${registerId}`);

      if (!userId || userId !== registerId) {
        console.error('createApplication: Invalid or unauthorized userId');
        return res.status(400).json({ error: 'Invalid or unauthorized userId' });
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error('createApplication: Invalid userId format:', userId);
        return res.status(400).json({ error: 'Invalid userId format' });
      }

      const draft = await createApplication.execute(registerId);
      console.log('createApplication: Draft created:', draft);
      res.status(201).json({ applicationId: draft.applicationId });
    } catch (err: any) {
      console.error('createApplication: Error:', err);
      res.status(400).json({ error: err.message || 'Failed to create application' });
    }
  }

  async getApplication(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('getApplication: Request received:', {
        params: req.params,
        headers: req.headers,
      });

      const { userId } = req.params;
      if (!req.user) {
        console.error('getApplication: req.user is undefined');
        return res.status(401).json({ error: 'User authentication required' });
      }
      const { id: registerId } = req.user;
      console.log(`getApplication: userId=${userId}, registerId=${registerId}`);

      if (userId !== registerId) {
        console.error('getApplication: Unauthorized access to application');
        return res.status(403).json({ error: 'Unauthorized access to application' });
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error('getApplication: Invalid userId format:', userId);
        return res.status(400).json({ error: 'Invalid userId format' });
      }

      const draft = await getApplication.execute(userId);
      console.log('getApplication: Draft fetched:', draft);
      res.status(200).json(draft || null);
    } catch (err: any) {
      console.error('getApplication: Error:', err);
      res.status(400).json({ error: err.message || 'Failed to fetch application' });
    }
  }

  async saveSection(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('saveSection: Request received:', {
        params: req.params,
        body: req.body,
        headers: req.headers,
      });

      const { applicationId, section } = req.params;
      const data = req.body;
      if (!req.user) {
        console.error('saveSection: req.user is undefined');
        return res.status(401).json({ error: 'User authentication required' });
      }
      const { id: registerId } = req.user;
      console.log(`saveSection: applicationId=${applicationId}, section=${section}`);

      const validSections = [
        'personalInfo',
        'choiceOfStudy',
        'education',
        'achievements',
        'otherInformation',
        'documents',
        'declaration',
      ];

      if (!validSections.includes(section)) {
        console.error('saveSection: Invalid section:', section);
        return res.status(400).json({ error: 'Invalid section' });
      }

      // Verify application belongs to user
      const draft = await AdmissionDraft.findOne({ applicationId, registerId });
      if (!draft) {
        console.error('saveSection: Application not found or unauthorized');
        return res.status(403).json({ error: 'Application not found or unauthorized' });
      }

      const updatedDraft = await saveSection.execute(applicationId, section, data);
      console.log('saveSection: Draft updated:', updatedDraft);
      res.status(200).json(updatedDraft as FormData);
    } catch (err: any) {
      console.error('saveSection: Error:', err);
      res.status(400).json({ error: err.message || 'Failed to save section' });
    }
  }

  async processPayment(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('processPayment: Request received:', {
        body: req.body,
        headers: req.headers,
      });

      const { applicationId, paymentDetails } = req.body;
      if (!req.user) {
        console.error('processPayment: req.user is undefined');
        return res.status(401).json({ error: 'User authentication required' });
      }
      const { id: registerId } = req.user;
      console.log(`processPayment: applicationId=${applicationId}`);

      if (!applicationId || !paymentDetails) {
        console.error('processPayment: Missing required fields');
        return res.status(400).json({ error: 'applicationId and paymentDetails are required' });
      }

      // Verify application belongs to user
      const draft = await AdmissionDraft.findOne({ applicationId, registerId });
      if (!draft) {
        console.error('processPayment: Application not found or unauthorized');
        return res.status(403).json({ error: 'Application not found or unauthorized' });
      }

      const paymentResult = await processPayment.execute(applicationId, paymentDetails);
      console.log('processPayment: Payment processed:', paymentResult);
      res.status(200).json({
        paymentId: paymentResult.paymentId,
        status: paymentResult.status,
        message: paymentResult.message,
        clientSecret: paymentResult.clientSecret,
      });
    } catch (err: any) {
      console.error('processPayment: Error:', err);
      res.status(400).json({ error: err.message || 'Payment processing failed' });
    }
  }

  async handleFinalSubmit(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('handleFinalSubmit: Request received:', {
        body: req.body,
        headers: req.headers,
      });

      const { applicationId, paymentId } = req.body;
      if (!req.user) {
        console.error('handleFinalSubmit: req.user is undefined');
        return res.status(401).json({ error: 'User authentication required' });
      }
      const { id: registerId } = req.user;
      console.log(`handleFinalSubmit: applicationId=${applicationId}, paymentId=${paymentId}`);

      if (!applicationId || !paymentId) {
        console.error('handleFinalSubmit: Missing required fields');
        return res.status(400).json({ error: 'applicationId and paymentId are required' });
      }

      // Verify application belongs to user
      const draft = await AdmissionDraft.findOne({ applicationId, registerId });
      if (!draft) {
        console.error('handleFinalSubmit: Application not found or unauthorized');
        return res.status(403).json({ error: 'Application not found or unauthorized' });
      }

      const result = await finalizeAdmission.execute(applicationId, paymentId);
      console.log('handleFinalSubmit: Admission finalized:', result);
      res.status(200).json({ message: 'Admission finalized', admission: result });
    } catch (err: any) {
      console.error('handleFinalSubmit: Error:', err);
      res.status(400).json({ error: err.message || 'Failed to finalize admission' });
    }
  }
}


export const admissionController = new AdmissionController();