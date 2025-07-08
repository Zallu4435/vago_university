import { FacultyErrorType } from "../enums/FacultyErrorType";
import { FacultyProps, FacultyStatus, FacultyRejectedBy } from "../FacultyTypes";

export class Faculty {
  private _id?: string;
  private _fullName: string;
  private _email: string;
  private _phone: string;
  private _department: string;
  private _qualification: string;
  private _experience: string;
  private _aboutMe: string;
  private _cvUrl?: string;
  private _certificatesUrl?: string[];
  private _status: FacultyStatus;
  private _confirmationToken?: string | null;
  private _tokenExpiry?: Date | null;
  private _rejectedBy?: FacultyRejectedBy;
  private _createdAt?: Date;

  constructor(props: FacultyProps & { status: FacultyStatus; confirmationToken?: string | null; tokenExpiry?: Date | null; rejectedBy?: FacultyRejectedBy; createdAt?: Date; }) {
    this._id = props.id;
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

  static create(props: FacultyProps & { status: FacultyStatus; confirmationToken?: string | null; tokenExpiry?: Date | null; rejectedBy?: FacultyRejectedBy; createdAt?: Date; }): Faculty {
    if (!props.fullName || !props.email) {
      throw new Error(FacultyErrorType.MissingRequiredFields);
    }
    return new Faculty(props);
  }

  get id(): string | undefined { return this._id; }
  get fullName(): string { return this._fullName; }
  get email(): string { return this._email; }
  get phone(): string { return this._phone; }
  get department(): string { return this._department; }
  get qualification(): string { return this._qualification; }
  get experience(): string { return this._experience; }
  get aboutMe(): string { return this._aboutMe; }
  get cvUrl(): string | undefined { return this._cvUrl; }
  get certificatesUrl(): string[] | undefined { return this._certificatesUrl; }
  get status(): FacultyStatus { return this._status; }
  get confirmationToken(): string | undefined | null { return this._confirmationToken; }
  get tokenExpiry(): Date | undefined | null { return this._tokenExpiry; }
  get rejectedBy(): FacultyRejectedBy | undefined { return this._rejectedBy; }
  get createdAt(): Date | undefined { return this._createdAt; }

  updateStatus(status: FacultyStatus, rejectedBy?: FacultyRejectedBy): void {
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