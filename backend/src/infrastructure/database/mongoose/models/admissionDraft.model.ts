import mongoose, { Schema, Document } from "mongoose";

interface IAdmissionDraft extends Document {
  applicationId: string;
  userId?: string;
  personal: any;
  choiceOfStudy: any;
  education: any;
  achievements: any;
  otherInformation: any;
  documents: any;
  declaration: any;
  completedSteps: string[];
  createdAt: Date;
  updatedAt: Date;
}

class AdmissionDraft {
  private admissionDraftSchema: Schema;

  constructor() {
    this.admissionDraftSchema = new Schema(
      {
        applicationId: { type: String, required: true, unique: true },
        userId: { type: mongoose.Types.ObjectId, ref: "User" },
        personal: { type: Object, default: {} },
        choiceOfStudy: { type: Array, default: [] },
        education: { type: Object, default: {} },
        achievements: { type: Object, default: {} },
        otherInformation: { type: Object, default: {} },
        documents: { type: Object, default: {} },
        declaration: { type: Object, default: {} },
        completedSteps: { type: [String], default: [] },
      },
      { timestamps: true }
    );
  }

  get model() {
    return mongoose.model<IAdmissionDraft>("AdmissionDraft", this.admissionDraftSchema);
  }
}

export const admissionDraft = new AdmissionDraft();