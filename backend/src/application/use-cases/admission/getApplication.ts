import { admissionDraft } from "../../../infrastructure/database/mongoose/models/admissionDraft.model";

class GetApplication {
  async execute(applicationId: string) {
    console.log(`Fetching application with applicationId: ${applicationId}`);
    const draft = await admissionDraft.model.findOne({ applicationId });
    if (!draft) {
      console.warn(`Application not found for applicationId: ${applicationId}`);
      return null;
    }
    console.log(`Fetched draft:`, draft);
    return draft.toObject();
  }
}

export const getApplication = new GetApplication();