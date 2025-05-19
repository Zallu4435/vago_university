import { AdmissionDraft } from '../../../infrastructure/database/mongoose/models/admissionDraft.model';
import mongoose from 'mongoose';

class GetApplication {
  async execute(registerId: string) {
    console.log(`Fetching application for registerId: ${registerId}`);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(registerId)) {
      throw new Error('Invalid registerId');
    }

    const draft = await AdmissionDraft.findOne({ registerId });
    if (!draft) {
      console.log(`Application not found for registerId: ${registerId}`);
      return null;
    }
    console.log(`Fetched draft:`, draft);
    return draft.toObject();
  }
}

export const getApplication = new GetApplication();