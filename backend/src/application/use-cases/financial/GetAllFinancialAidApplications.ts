import { FinancialAidApplicationModel } from '../../../infrastructure/database/mongoose/models/financial.model';

export class GetAllFinancialAidApplications {
  async execute(filters: { status?: string; term?: string; page: number; limit: number }): Promise<{ data: any[]; total: number }> {
    try {
      const query: any = {};
      if (filters.status) query.status = filters.status;
      if (filters.term) query.term = filters.term;

      const total = await FinancialAidApplicationModel.countDocuments(query);
      const applications = await FinancialAidApplicationModel.find(query)
        .skip((filters.page - 1) * filters.limit)
        .limit(filters.limit)
        .lean();

      return {
        data: applications.map(app => ({
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
        })),
        total,
      };
    } catch (err) {
      console.error('GetAllFinancialAidApplications Error:', err);
      throw new Error(`Failed to fetch financial aid applications: ${err.message}`);
    }
  }
}   