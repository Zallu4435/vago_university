import { admissionDraft } from "../../../infrastructure/database/mongoose/models/admissionDraft.model";

class SavePersonal {
    async execute(userId: string, date: any) {
        let draft = await admissionDraft.model.findOne({ userId });

        if (!draft) {
            draft = new admissionDraft.model({ userId });

            draft.personal = date;
            if (!draft.completedSteps.includes('personal')) {
                draft.completedSteps.push('personal')
            }

            await draft.save();
            return draft;
        }
    }
}

export const savePersonal = new SavePersonal();
