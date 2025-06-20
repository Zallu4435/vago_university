import mongoose from "mongoose";
import { FacultyErrorType } from "../enums/FacultyErrorType";

export interface FacultyProps {
  _id?: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone?: string;
  department?: string;
  qualification?: string;
  experience?: string;
  aboutMe?: string;
  cvUrl?: string;
  certificatesUrl?: string[];
  status: "pending" | "approved" | "rejected" | "offered";
  confirmationToken?: string;
  tokenExpiry?: Date;
  rejectedBy?: string;
  createdAt?: Date;
}

export class Faculty {
  private _id?: mongoose.Types.ObjectId;
  private _fullName: string;
  private _email: string;
  private _phone?: string;
  private _department?: string;
  private _qualification?: string;
  private _experience?: string;
  private _aboutMe?: string;
  private _cvUrl?: string;
  private _certificatesUrl?: string[];
  private _status: "pending" | "approved" | "rejected" | "offered";
  private _confirmationToken?: string;
  private _tokenExpiry?: Date;
  private _rejectedBy?: string;
  private _createdAt?: Date;

  constructor(props: FacultyProps) {
    this._id = props._id;
    this._fullName = props.fullName;
    this._email = props.email;
    this._phone = props.phone;
    this._department = props.department;
    this._qualification = props.qualification;
    this._experience = props.experience;
    this._aboutMe = props.aboutMe;
    this._cvUrl = props.cvUrl;
    this._certificatesUrl = props.certificatesUrl;
    this._status = props.status;
    this._confirmationToken = props.confirmationToken;
    this._tokenExpiry = props.tokenExpiry;
    this._rejectedBy = props.rejectedBy;
    this._createdAt = props.createdAt;
  }

  static create(props: FacultyProps): Faculty {
    if (!props.fullName || !props.email) {
      throw new Error(FacultyErrorType.MissingRequiredFields);
    }
    return new Faculty(props);
  }

  get id(): mongoose.Types.ObjectId | undefined { return this._id; }
  get fullName(): string { return this._fullName; }
  get email(): string { return this._email; }
  get phone(): string | undefined { return this._phone; }
  get department(): string | undefined { return this._department; }
  get qualification(): string | undefined { return this._qualification; }
  get experience(): string | undefined { return this._experience; }
  get aboutMe(): string | undefined { return this._aboutMe; }
  get cvUrl(): string | undefined { return this._cvUrl; }
  get certificatesUrl(): string[] | undefined { return this._certificatesUrl; }
  get status(): "pending" | "approved" | "rejected" | "offered" { return this._status; }
  get confirmationToken(): string | undefined { return this._confirmationToken; }
  get tokenExpiry(): Date | undefined { return this._tokenExpiry; }
  get rejectedBy(): string | undefined { return this._rejectedBy; }
  get createdAt(): Date | undefined { return this._createdAt; }

  updateStatus(status: "pending" | "approved" | "rejected" | "offered", rejectedBy?: string): void {
    if (!["pending", "approved", "rejected", "offered"].includes(status)) {
      throw new Error(FacultyErrorType.InvalidStatus);
    }
    this._status = status;
    this._rejectedBy = rejectedBy;
  }

  updateDepartment(department: string): void {
    this._department = department;
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