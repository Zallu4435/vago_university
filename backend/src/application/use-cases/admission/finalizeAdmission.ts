import { admissionDraft } from "../../../infrastructure/database/mongoose/models/admissionDraft.model";
import { Admission } from "../../../infrastructure/database/mongoose/models/admission.model";
import { Payment } from "../../../infrastructure/database/mongoose/models/payment.model";

class FinalizeAdmission {
  async execute(applicationId: string, paymentDetails: any) {
    const draft = await admissionDraft.model.findOne({ applicationId });
    if (!draft) {
      throw new Error("Draft not found");
    }

    // Create payment record
    const payment = new Payment.model({
      applicationId,
      paymentDetails,
      status: "completed", // Adjust based on payment gateway response
    });
    await payment.save();

    // Create admission record
    const newAdmission = new Admission.model({
      applicationId,
      personal: draft.personal,
      choiceOfStudy: draft.choiceOfStudy,
      education: draft.education,
      achievements: draft.achievements,
      otherInformation: draft.otherInformation,
      documents: draft.documents,
      declaration: draft.declaration,
      paymentId: payment._id,
    });

    await newAdmission.save();

    // Delete draft
    await admissionDraft.model.deleteOne({ applicationId });

    return newAdmission;
  }
}

export const finalizeAdmission = new FinalizeAdmission();