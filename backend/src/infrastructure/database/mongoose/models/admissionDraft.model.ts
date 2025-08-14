import mongoose, { Schema, Document, Model } from 'mongoose';

// Types for admission draft fields
interface PersonalInfo {
  [key: string]: unknown;
}

interface ChoiceOfStudy {
  [key: string]: unknown;
}

interface EducationInfo {
  [key: string]: unknown;
}

interface AchievementsInfo {
  [key: string]: unknown;
}

interface OtherInformationInfo {
  [key: string]: unknown;
}

interface DocumentsInfo {
  [key: string]: unknown;
}

interface DeclarationInfo {
  [key: string]: unknown;
}

interface IAdmissionDraftDocument extends Document {
  applicationId: string;
  registerId: mongoose.Types.ObjectId;
  personal: PersonalInfo;
  choiceOfStudy: ChoiceOfStudy[];
  education: EducationInfo;
  achievements: AchievementsInfo;
  otherInformation: OtherInformationInfo;
  documents: DocumentsInfo;
  declaration: DeclarationInfo;
  completedSteps: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionDraftSchema: Schema = new Schema(
  {
    applicationId: { type: String, required: true, unique: true },
    registerId: { type: Schema.Types.ObjectId, required: true, ref: 'Register' },
    personal: { type: Object, default: {} },
    choiceOfStudy: { type: [Schema.Types.Mixed], default: [] },
    education: { type: Object, default: {} },
    achievements: { type: Object, default: {} },
    otherInformation: { type: Object, default: {} },
    documents: { type: Object, default: {} },
    declaration: { type: Object, default: {} },
    completedSteps: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const AdmissionDraft: Model<IAdmissionDraftDocument> = mongoose.models.AdmissionDraft || mongoose.model<IAdmissionDraftDocument>('AdmissionDraft', AdmissionDraftSchema);