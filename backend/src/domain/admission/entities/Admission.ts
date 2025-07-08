import { 
  AdmissionDraftProps, 
  AdmissionProps, 
  AdmissionStatus, 
  RejectedBy,
  PaymentStatus,
  PaymentMethod
} from "./AdmissionTypes";
import { AdmissionErrorType } from "../enums/AdmissionErrorType";

export { 
  PaymentStatus, 
  PaymentMethod, 
  AdmissionStatus, 
  RejectedBy,
  AdmissionDraftProps,
  AdmissionProps
} from "./AdmissionTypes";

export class AdmissionDraft {
  private _id?: string;
  private applicationId: string;
  private registerId: string;
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
    this._id = props.id;
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
    return new AdmissionDraft(props);
  }

  get id(): string | undefined { return this._id; }
  getApplicationId(): string { return this.applicationId; }
  getRegisterId(): string { return this.registerId; }
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