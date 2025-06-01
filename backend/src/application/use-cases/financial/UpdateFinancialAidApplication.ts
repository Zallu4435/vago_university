import mongoose from 'mongoose';
import { FinancialAidApplicationModel } from '../../../infrastructure/database/mongoose/models/financial.model';

interface UpdateFinancialAidInput {
  status?: 'Approved' | 'Pending' | 'Rejected';
  amount?: number;
}

export class UpdateFinancialAidApplication {
  async execute(studentId: string, applicationId: string, input: UpdateFinancialAidInput): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(applicationId)) {
        throw new Error('Invalid student or application ID');
      }
      if (input.amount !== undefined && input.amount <= 0) {
        throw new Error('Amount must be greater than zero');
      }
      const application = await FinancialAidApplicationModel.findOneAndUpdate(
        { _id: applicationId, studentId },
        { $set: input },
        { new: true }
      ).lean();
      if (!application) throw new Error('No financial aid application found with the specified ID');
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
      console.error('UpdateFinancialAidApplication Error:', err);
      throw new Error(`Failed to update financial aid application: ${err.message}`);
    }
  }
}