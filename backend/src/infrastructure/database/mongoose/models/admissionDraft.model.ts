import mongoose, { Schema, Document } from "mongoose";

interface IAdmissionDraft extends Document {
  userId: string;
  personal: any;
  choiceOfStudy: any;
  education: any;
  achievements: any;
  otherInformation: any;
  documents: any;
  compltedSteps: string[];
}

class AdmissionDraft {
  private admissionDraftSchema: Schema;

  constructor() {
    this.admissionDraftSchema = new Schema(
      {
        userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
        personal: { type: Object },
        choiceOfStudy: { type: Object },
        education: { type: Object },
        achievements: { type: Object },
        otherInformation: { type: Object },
        documents: { type: Object },
        completedSteps: [String],
      },
      { timestamps: true }
    );
  }

  get model () {
    return mongoose.model<IAdmissionDraft>('AdmissionDraft', this.admissionDraftSchema);
  }
}

export const admissionDraft = new AdmissionDraft();
