import mongoose from 'mongoose';
import { ScholarshipApplicationModel } from '../../../infrastructure/database/mongoose/models/financial.model';

export class GetScholarshipApplications {
  async execute(studentId: string, status?: string): Promise<any[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
      }
      const query: any = { studentId };
      if (status) query.status = status;
      const applications = await ScholarshipApplicationModel.find(query).lean();
      if (!applications.length) return [];
      return applications.map(app => ({
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
      }));
    } catch (err) {
      console.error('GetScholarshipApplications Error:', err);
      throw new Error(`Failed to fetch scholarship applications: ${err.message}`);
    }
  }
}