import { ScholarshipApplicationModel } from '../../../infrastructure/database/mongoose/models/financial.model';

export class GetAllScholarshipApplications {
  async execute(filters: { status?: string; page: number; limit: number }): Promise<{ data: any[]; total: number }> {
    try {
      const query: any = {};
      if (filters.status) query.status = filters.status;

      const total = await ScholarshipApplicationModel.countDocuments(query);
      const applications = await ScholarshipApplicationModel.find(query)
        .skip((filters.page - 1) * filters.limit)
        .limit(filters.limit)
        .lean();

      return {
        data: applications.map(app => ({
          id: app._id.toString(),
          scholarshipId: app.scholarshipId.toString(),
          studentId: app.studentId.toString(),
          status: app.status,
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
      console.error('GetAllScholarshipApplications Error:', err);
      throw new Error(`Failed to fetch scholarship applications: ${err.message}`);
    }
  }
}