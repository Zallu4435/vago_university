import mongoose from 'mongoose';
import { ScholarshipApplicationModel } from '../../../infrastructure/database/mongoose/models/financial.model';

interface UpdateScholarshipInput {
  status?: 'Approved' | 'Pending' | 'Rejected';
}

export class UpdateScholarshipApplication {
  async execute(studentId: string, applicationId: string, input: UpdateScholarshipInput): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(applicationId)) {
        throw new Error('Invalid student or application ID');
      }
      const application = await ScholarshipApplicationModel.findOneAndUpdate(
        { _id: applicationId, studentId },
        { $set: input },
        { new: true }
      ).lean();
      if (!application) throw new Error('No scholarship application found with the specified ID');
      return {
        id: application._id.toString(),
        scholarshipId: application.scholarshipId.toString(),
        studentId: application.studentId.toString(),
        status: application.status,
        applicationDate: application.applicationDate.toISOString(),
        documents: application.documents.map(doc => ({
          id: doc.id,
          name: doc.name,
          url: doc.url,
          status: doc.status,
        })),
      };
    } catch (err) {
      console.error('UpdateScholarshipApplication Error:', err);
      throw new Error(`Failed to update scholarship application: ${err.message}`);
    }
  }
}