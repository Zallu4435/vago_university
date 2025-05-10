import { admissionDraft } from "../../../infrastructure/database/mongoose/models/admissionDraft.model";
import { Admission } from "../../../infrastructure/database/mongoose/models/admission.model";

class FinalizeAdmission {
    async execute (userId: string, paymentDetails: any) {
        const draft = await admissionDraft.model.findOne({ userId });
        if (!draft) throw new Error("Draft not found");

        const newAdmission = new Admission.model({
            userId,
            personal: draft.personal,
            choiceOfStudy: draft.choiceOfStudy,
            education: draft.education,
            achievements: draft.achievements,
            otherInformation: draft.otherInformation,
            documents: draft.documents,
            paymentDetails
        });

        await Admission.save();
        await admissionDraft.model.deleteOne({ userId });

        return newAdmission;
    }
}

export const finalizeAdmission = new FinalizeAdmission();