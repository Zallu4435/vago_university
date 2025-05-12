import { AdmissionDraft } from "../../../infrastructure/database/mongoose/models/admissionDraft.model";

class CreateApplication {
  async execute(applicationId: string) {
    console.log(`Creating application with applicationId: ${applicationId}`);

    // Check if draft already exists
    let draft = await AdmissionDraft.findOne({ applicationId });
    if (draft) {
      console.warn(`Application ID ${applicationId} already exists`);
      throw new Error("Application ID already exists");
    }

    // Create new draft
    draft = new AdmissionDraft({
      applicationId,
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

    return draft.toObject(); // Ensure plain object is returned
  }
}

export const createApplication = new CreateApplication();
