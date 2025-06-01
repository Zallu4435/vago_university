import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ScholarshipModel, ScholarshipApplicationModel } from '../../../infrastructure/database/mongoose/models/financial.model';

interface ScholarshipApplicationInput {
  scholarshipId: string;
  documents: Array<{ name: string; url: string }>;
}

export class ApplyForScholarship {
  async execute(studentId: string, input: ScholarshipApplicationInput): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
      }
      if (!mongoose.Types.ObjectId.isValid(input.scholarshipId)) {
        throw new Error('Invalid scholarship ID');
      }
      const scholarship = await ScholarshipModel.findById(input.scholarshipId);
      if (!scholarship) {
        throw new Error('No scholarship found with the provided ID');
      }
      if (scholarship.status === 'Closed') {
        throw new Error('Scholarship application is closed');
      }
      const application = new ScholarshipApplicationModel({
        scholarshipId: input.scholarshipId,
        studentId,
        status: 'Pending',
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
      console.error('ApplyForScholarship Error:', err);
      throw new Error(`Failed to apply for scholarship: ${err.message}`);
    }
  }
}