import { AdmissionDraft } from "../../../infrastructure/database/mongoose/models/admissionDraft.model";
import { Admission } from "../../../infrastructure/database/mongoose/models/admission.model";
import { Payment } from "../../../infrastructure/database/mongoose/models/payment.model";

class FinalizeAdmission {
  async execute(applicationId: string, paymentId: string) {
    // Fetch Draft
    const draft = await AdmissionDraft.findOne({ applicationId });
    if (!draft) throw new Error("Draft not found");

    // Fetch Payment
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new Error("Payment not found");

    if (payment.applicationId !== applicationId) {
      throw new Error("Payment does not belong to this application");
    }

    // Update payment status if needed
    if (payment.status !== "completed") {
      payment.status = "completed";
      await payment.save();
    }
    // Create Admission Record
    const newAdmission = new Admission({
      applicationId,
      registerId: draft.registerId,
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

    // Delete draft after finalizing
    await AdmissionDraft.deleteOne({ applicationId });

    return newAdmission;
  }
}

export const finalizeAdmission = new FinalizeAdmission();
