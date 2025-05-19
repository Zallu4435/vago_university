import mongoose, { Schema, Document, Model } from 'mongoose';
// import {
//   PersonalInfo,
//   ProgrammeChoice,
//   EducationData,
//   AchievementSection,
//   OtherInformationSection,
//   DocumentUploadSection,
//   DeclarationSection,
// } from '../../../../domain/types/formTypes';

interface IAdmissionDraft extends Document {
  applicationId: string;
  registerId: mongoose.Types.ObjectId;
  personal: any;
  choiceOfStudy: any[];
  education: any;
  achievements: any;
  otherInformation: any;
  documents: any;
  declaration: any;
  completedSteps: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionDraftSchema: Schema = new Schema(
  {
    applicationId: { type: String, required: true, unique: true },
    registerId: { type: Schema.Types.ObjectId, required: true, ref: 'Register' },
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

export const AdmissionDraft: Model<IAdmissionDraft> = mongoose.models.AdmissionDraft || mongoose.model<IAdmissionDraft>('AdmissionDraft', AdmissionDraftSchema);