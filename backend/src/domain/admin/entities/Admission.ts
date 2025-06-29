import mongoose from "mongoose";
import { AdmissionErrorType } from "../enums/AdmissionErrorType";

export interface AdmissionProps {
  _id?: mongoose.Types.ObjectId;
  registerId: mongoose.Types.ObjectId;
  applicationId: string;
  personal: {
    fullName: string;
    emailAddress: string;
  };
  choiceOfStudy: Array<{
    programme: string;
    degree?: string;
    catalogYear?: string;
  }>;
  status: "pending" | "approved" | "rejected" | "offered";
  confirmationToken?: string;
  tokenExpiry?: Date;
  rejectedBy?: string;
  createdAt?: Date;
}

export class Admission {
  private _id?: mongoose.Types.ObjectId;
  private _registerId: mongoose.Types.ObjectId;
  private _applicationId: string;
  private _personal: { fullName: string; emailAddress: string };
  private _choiceOfStudy: Array<{ programme: string; degree?: string; catalogYear?: string }>;
  private _status: "pending" | "approved" | "rejected" | "offered";
  private _confirmationToken?: string;
  private _tokenExpiry?: Date;
  private _rejectedBy?: string;
  private _createdAt?: Date;

  constructor(props: AdmissionProps) {
    this._id = props._id;
    this._registerId = props.registerId;
    this._applicationId = props.applicationId;
    this._personal = props.personal;
    this._choiceOfStudy = props.choiceOfStudy;
    this._status = props.status;
    this._confirmationToken = props.confirmationToken;
    this._tokenExpiry = props.tokenExpiry;
    this._rejectedBy = props.rejectedBy;
    this._createdAt = props.createdAt;
  }

  static create(props: AdmissionProps): Admission {
    if (!props.registerId || !props.applicationId || !props.personal.fullName || !props.personal.emailAddress) {
      throw new Error(AdmissionErrorType.MissingRequiredFields);
    }
    return new Admission(props);
  }

  get id(): mongoose.Types.ObjectId | undefined { return this._id; }
  get registerId(): mongoose.Types.ObjectId { return this._registerId; }
  get applicationId(): string { return this._applicationId; }
  get personal(): { fullName: string; emailAddress: string } { return this._personal; }
  get choiceOfStudy(): Array<{ programme: string; degree?: string; catalogYear?: string }> { return this._choiceOfStudy; }
  get status(): "pending" | "approved" | "rejected" | "offered" { return this._status; }
  get confirmationToken(): string | undefined { return this._confirmationToken; }
  get tokenExpiry(): Date | undefined { return this._tokenExpiry; }
  get rejectedBy(): string | undefined { return this._rejectedBy; }
  get createdAt(): Date | undefined { return this._createdAt; }

  updateStatus(status: "pending" | "approved" | "rejected" | "offered", rejectedBy?: string): void {
    if (!["pending", "approved", "rejected", "offered"].includes(status)) {
      throw new Error(AdmissionErrorType.InvalidStatus);
    }
    this._status = status;
    this._rejectedBy = rejectedBy;
  }

  setConfirmationToken(token: string, expiry: Date): void {
    this._confirmationToken = token;
    this._tokenExpiry = expiry;
  }

  clearConfirmationToken(): void {
    this._confirmationToken = undefined;
    this._tokenExpiry = undefined;
  }
}