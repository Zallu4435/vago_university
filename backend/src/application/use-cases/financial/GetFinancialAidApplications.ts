import mongoose from 'mongoose';
import { FinancialAidApplicationModel } from '../../../infrastructure/database/mongoose/models/financial.model';

export class GetFinancialAidApplications {
  async execute(studentId: string, status?: string): Promise<any[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
      }
      const query: any = { studentId };
      if (status) query.status = status;
      const applications = await FinancialAidApplicationModel.find(query).lean();
      if (!applications.length) return [];
      return applications.map(app => ({
        id: app._id.toString(),
        studentId: app.studentId.toString(),
        term: app.term,
        status: app.status,
        amount: app.amount,
        type: app.type,
        applicationDate: app.applicationDate.toISOString(),
        documents: app.documents.map(doc => ({
          id: doc.id,
          name: doc.name,
          url: doc.url,
          status: doc.status,
        })),
      }));
    } catch (err) {
      console.error('GetFinancialAidApplications Error:', err);
      throw new Error(`Failed to fetch financial aid applications: ${err.message}`);
    }
  }
}