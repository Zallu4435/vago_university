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
  USER = "user",
  NULL = null,
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
  private _applicationId: string;
  private _registerId: mongoose.Types.ObjectId;
  private _personal: any;
  private _choiceOfStudy: any[];
  private _education: any;
  private _achievements: any;
  private _otherInformation: any;
  private _documents: any;
  private _declaration: any;
  private _completedSteps: string[];
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(props: AdmissionDraftProps) {
    this._applicationId = props.applicationId;
    this._registerId = props.registerId;
    this._personal = props.personal || {};
    this._choiceOfStudy = props.choiceOfStudy || [];
    this._education = props.education || {};
    this._achievements = props.achievements || {};
    this._otherInformation = props.otherInformation || {};
    this._documents = props.documents || {};
    this._declaration = props.declaration || {};
    this._completedSteps = props.completedSteps || [];
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
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

  get applicationId(): string { return this._applicationId; }
  get registerId(): mongoose.Types.ObjectId { return this._registerId; }
  get personal(): any { return this._personal; }
  get choiceOfStudy(): any[] { return this._choiceOfStudy; }
  get education(): any { return this._education; }
  get achievements(): any { return this._achievements; }
  get otherInformation(): any { return this._otherInformation; }
  get documents(): any { return this._documents; }
  get declaration(): any { return this._declaration; }
  get completedSteps(): string[] { return this._completedSteps; }
  get createdAt(): Date | undefined { return this._createdAt; }
  get updatedAt(): Date | undefined { return this._updatedAt; }
}

export class Admission extends AdmissionDraft {
  private _paymentId: string;
  private _status: AdmissionStatus;
  private _rejectedBy: RejectedBy | null;
  private _confirmationToken: string | null;
  private _tokenExpiry: Date | null;

  constructor(props: AdmissionProps) {
    super(props);
    this._paymentId = props.paymentId;
    this._status = props.status || AdmissionStatus.PENDING;
    this._rejectedBy = props.rejectedBy || null;
    this._confirmationToken = props.confirmationToken || null;
    this._tokenExpiry = props.tokenExpiry || null;
  }

  static create(props: AdmissionProps): Admission {
    if (!props.paymentId) {
      throw new Error(AdmissionErrorType.InvalidPaymentId);
    }
    return new Admission(props);
  }

  get paymentId(): string { return this._paymentId; }
  get status(): AdmissionStatus { return this._status; }
  get rejectedBy(): RejectedBy | null { return this._rejectedBy; }
  get confirmationToken(): string | null { return this._confirmationToken; }
  get tokenExpiry(): Date | null { return this._tokenExpiry; }
}