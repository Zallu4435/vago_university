import { AdmissionDraft } from '../../../infrastructure/database/mongoose/models/admissionDraft.model';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

class CreateApplication {
  async execute(registerId: string) {
    console.log(`Creating application for registerId: ${registerId}`);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(registerId)) {
      throw new Error('Invalid registerId');
    }

    // Check if draft already exists for user
    let draft = await AdmissionDraft.findOne({ registerId });
    if (draft) {
      console.log(`Existing application found: ${draft.applicationId}`);
      return draft.toObject();
    }

    // Generate unique applicationId
    const applicationId = uuidv4();

    // Create new draft
    draft = new AdmissionDraft({
      applicationId,
      registerId,
      personal: {},
      choiceOfStudy: [],
      education: {},
      achievements: {},
      otherInformation: {},
      documents: {},
      declaration: {},
      completedSteps: [],
    });

    await draft.save();

    console.log(`Created draft:`, draft);
    return draft.toObject();
  }
}

export const createApplication = new CreateApplication();