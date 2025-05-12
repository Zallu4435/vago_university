import { AdmissionDraft } from "../../../infrastructure/database/mongoose/models/admissionDraft.model";

class SavePersonal {
  async execute(userId: string, data: any) {
    let draft = await AdmissionDraft.findOne({ userId });

    if (!draft) {
      draft = new AdmissionDraft({ userId });
    }

    draft.personal = data;

    if (!draft.completedSteps.includes('personal')) {
      draft.completedSteps.push('personal');
    }

    await draft.save();

    return draft;
  }
}

export const savePersonal = new SavePersonal();
 