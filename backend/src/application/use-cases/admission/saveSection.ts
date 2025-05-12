import { AdmissionDraft } from "../../../infrastructure/database/mongoose/models/admissionDraft.model";

class SaveSection {
  async execute(applicationId: string, section: string, data: any) {
    console.log(`Saving section ${section} for applicationId ${applicationId}:`, data);

    let draft = await AdmissionDraft.findOne({ applicationId });
    if (!draft) {
      console.error(`Draft not found for applicationId ${applicationId}`);
      throw new Error("Application draft not found");
    }

    const sectionMap: { [key: string]: string } = {
      personalInfo: "personal",
      choiceOfStudy: "choiceOfStudy",
      education: "education",
      achievements: "achievements",
      otherInformation: "otherInformation",
      documents: "documents",
      declaration: "declaration",
    };

    const field = sectionMap[section];
    if (!field) {
      console.error(`Invalid section: ${section}`);
      throw new Error("Invalid section");
    }

    draft[field] = data;

    if (!draft.completedSteps.includes(field)) {
      draft.completedSteps.push(field);
    }

    await draft.save();

    console.log(`Saved draft:`, draft.toObject());
    return draft.toObject();
  }
}

export const saveSection = new SaveSection();
