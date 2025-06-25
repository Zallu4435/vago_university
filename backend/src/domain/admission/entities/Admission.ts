import mongoose from "mongoose";
import { AdmissionErrorType } from "../enums/AdmissionErrorType";

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  STRIPE = "stripe",
}

export enum AdmissionStatus {
  PENDING = "pending",
  OFFERED = "offered",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum RejectedBy {
  ADMIN = "admin",
  USER = "user"
}

interface AdmissionDraftProps {
  applicationId: string;
  registerId: mongoose.Types.ObjectId;
  personal?: any;
  choiceOfStudy?: any[];
  education?: any;
  achievements?: any;
  otherInformation?: any;
  documents?: any;
  declaration?: any;
  completedSteps?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface AdmissionProps extends AdmissionDraftProps {
  paymentId: string;
  status?: AdmissionStatus;
  rejectedBy?: RejectedBy | null;
  confirmationToken?: string | null;
  tokenExpiry?: Date | null;
}

export class AdmissionDraft {
  private applicationId: string;
  private registerId: mongoose.Types.ObjectId;
  private personal: any;
  private choiceOfStudy: any[];
  private education: any;
  private achievements: any;
  private otherInformation: any;
  private documents: any;
  private declaration: any;
  private completedSteps: string[];
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(props: AdmissionDraftProps) {
    this.applicationId = props.applicationId;
    this.registerId = props.registerId;
    this.personal = props.personal || {};
    this.choiceOfStudy = props.choiceOfStudy || [];
    this.education = props.education || {};
    this.achievements = props.achievements || {};
    this.otherInformation = props.otherInformation || {};
    this.documents = props.documents || {};
    this.declaration = props.declaration || {};
    this.completedSteps = props.completedSteps || [];
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: AdmissionDraftProps): AdmissionDraft {
    if (!props.applicationId) {
      throw new Error(AdmissionErrorType.InvalidApplicationId);
    }
    if (!mongoose.Types.ObjectId.isValid(props.registerId)) {
      throw new Error(AdmissionErrorType.InvalidRegisterId);
    }
    return new AdmissionDraft(props);
  }

  getApplicationId(): string { return this.applicationId; }
  getRegisterId(): mongoose.Types.ObjectId { return this.registerId; }
  getPersonal(): any { return this.personal; }
  getChoiceOfStudy(): any[] { return this.choiceOfStudy; }
  getEducation(): any { return this.education; }
  getAchievements(): any { return this.achievements; }
  getOtherInformation(): any { return this.otherInformation; }
  getDocuments(): any { return this.documents; }
  getDeclaration(): any { return this.declaration; }
  getCompletedSteps(): string[] { return this.completedSteps; }
  getCreatedAt(): Date | undefined { return this.createdAt; }
  getUpdatedAt(): Date | undefined { return this.updatedAt; }
}

export class Admission extends AdmissionDraft {
  private paymentId: string;
  private status: AdmissionStatus;
  private rejectedBy: RejectedBy | null;
  private confirmationToken: string | null;
  private tokenExpiry: Date | null;

  constructor(props: AdmissionProps) {
    super(props);
    this.paymentId = props.paymentId;
    this.status = props.status || AdmissionStatus.PENDING;
    this.rejectedBy = props.rejectedBy || null;
    this.confirmationToken = props.confirmationToken || null;
    this.tokenExpiry = props.tokenExpiry || null;
  }

  static create(props: AdmissionProps): Admission {
    if (!props.paymentId) {
      throw new Error(AdmissionErrorType.InvalidPaymentId);
    }
    return new Admission(props);
  }

  getPaymentId(): string { return this.paymentId; }
  getStatus(): AdmissionStatus { return this.status; }
  getRejectedBy(): RejectedBy | null { return this.rejectedBy; }
  getConfirmationToken(): string | null { return this.confirmationToken; }
  getTokenExpiry(): Date | null { return this.tokenExpiry; }
}