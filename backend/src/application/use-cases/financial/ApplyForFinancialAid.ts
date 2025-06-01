import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { FinancialAidApplicationModel } from '../../../infrastructure/database/mongoose/models/financial.model';

interface FinancialAidInput {
  term: string;
  amount: number;
  type: 'Grant' | 'Loan' | 'Scholarship';
  documents: Array<{ name: string; url: string }>;
}

export class ApplyForFinancialAid {
  async execute(studentId: string, input: FinancialAidInput): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
      }
      if (input.amount <= 0) {
        throw new Error('Amount must be greater than zero');
      }
      if (!input.documents.length) {
        throw new Error('At least one document is required');
      }
      const application = new FinancialAidApplicationModel({
        studentId,
        term: input.term,
        status: 'Pending',
        amount: input.amount,
        type: input.type,
        applicationDate: new Date(),
        documents: input.documents.map(doc => ({
          id: uuidv4(),
          name: doc.name,
          url: doc.url,
          status: 'Pending',
        })),
      });
      await application.save();
      return {
        id: application._id.toString(),
        studentId: application.studentId.toString(),
        term: application.term,
        status: application.status,
        amount: application.amount,
        type: application.type,
        applicationDate: application.applicationDate.toISOString(),
        documents: application.documents.map(doc => ({
          id: doc.id,
          name: doc.name,
          url: doc.url,
          status: doc.status,
        })),
      };
    } catch (err) {
      console.error('ApplyForFinancialAid Error:', err);
      throw new Error(`Failed to apply for financial aid: ${err.message}`);
    }
  }
}