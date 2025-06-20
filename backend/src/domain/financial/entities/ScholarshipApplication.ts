import mongoose from "mongoose";
import { FinancialErrorType } from "../enums/FinancialErrorType";

export interface Document {
  id: string;
  name: string;
  url: string;
  status: "Verified" | "Pending" | "Rejected";
}

export interface ScholarshipApplicationProps {
  _id?: mongoose.Types.ObjectId;
  scholarshipId: string;
  studentId: string;
  status: "Approved" | "Pending" | "Rejected";
  applicationDate: Date;
  documents: Document[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class ScholarshipApplication {
  private _id?: mongoose.Types.ObjectId;
  private _scholarshipId: string;
  private _studentId: string;
  private _status: "Approved" | "Pending" | "Rejected";
  private _applicationDate: Date;
  private _documents: Document[];
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(props: ScholarshipApplicationProps) {
    this._id = props._id;
    this._scholarshipId = props.scholarshipId;
    this._studentId = props.studentId;
    this._status = props.status;
    this._applicationDate = props.applicationDate;
    this._documents = props.documents;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: ScholarshipApplicationProps): ScholarshipApplication {
    if (!mongoose.Types.ObjectId.isValid(props.scholarshipId) || !mongoose.Types.ObjectId.isValid(props.studentId)) {
      throw new Error(FinancialErrorType.InvalidId);
    }
    if (!props.documents.length) {
      throw new Error(FinancialErrorType.MissingDocuments);
    }
    if (!["Approved", "Pending", "Rejected"].includes(props.status)) {
      throw new Error(FinancialErrorType.InvalidStatus);
    }
    return new ScholarshipApplication(props);
  }

  get id(): mongoose.Types.ObjectId | undefined { return this._id; }
  get scholarshipId(): string { return this._scholarshipId; }
  get studentId(): string { return this._studentId; }
  get status(): "Approved" | "Pending" | "Rejected" { return this._status; }
  get applicationDate(): Date { return this._applicationDate; }
  get documents(): Document[] { return this._documents; }
  get createdAt(): Date | undefined { return this._createdAt; }
  get updatedAt(): Date | undefined { return this._updatedAt; }

  updateStatus(status: "Approved" | "Pending" | "Rejected"): void {
    if (!["Approved", "Pending", "Rejected"].includes(status)) {
      throw new Error(FinancialErrorType.InvalidStatus);
    }
    this._status = status;
  }
}