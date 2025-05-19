import mongoose, { Schema, Document, Model } from 'mongoose';
import {
  PersonalInfo,
  ProgrammeChoice,
  EducationData,
  AchievementSection,
  OtherInformationSection,
  DocumentUploadSection,
  DeclarationSection,
} from '../../../../domain/types/formTypes';

interface IAdmission extends Document {
  applicationId: string;
  registerId: mongoose.Types.ObjectId;
  personal: PersonalInfo;
  choiceOfStudy: ProgrammeChoice[];
  education: EducationData;
  achievements: AchievementSection;
  otherInformation: OtherInformationSection;
  documents: DocumentUploadSection;
  declaration: DeclarationSection;
  paymentId: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionSchema: Schema = new Schema(
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
    paymentId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Admission: Model<IAdmission> = mongoose.models.Admission || mongoose.model<IAdmission>('Admission', AdmissionSchema);