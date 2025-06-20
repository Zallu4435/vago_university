import mongoose from "mongoose";
import { FinancialErrorType } from "../enums/FinancialErrorType";

export interface StudentFinancialInfoProps {
  _id?: mongoose.Types.ObjectId;
  studentId: string;
  chargeId: string;
  amount: number;
  paymentDueDate: Date;
  status: "Paid" | "Pending";
  term: string;
  issuedAt: Date;
  paidAt?: Date;
  method?: string;
  createdAt?: Date;
  updatedAt?: Date;
  chargeTitle?: string;
  chargeDescription?: string;
}

export class StudentFinancialInfo {
  private _id?: mongoose.Types.ObjectId;
  private _studentId: string;
  private _chargeId: string;
  private _amount: number;
  private _paymentDueDate: Date;
  private _status: "Paid" | "Pending";
  private _term: string;
  private _issuedAt: Date;
  private _paidAt?: Date;
  private _method?: string;
  private _createdAt?: Date;
  private _updatedAt?: Date;
  private _chargeTitle?: string;
  private _chargeDescription?: string;

  constructor(props: StudentFinancialInfoProps) {
    this._id = props._id;
    this._studentId = props.studentId;
    this._chargeId = props.chargeId;
    this._amount = props.amount;
    this._paymentDueDate = props.paymentDueDate;
    this._status = props.status;
    this._term = props.term;
    this._issuedAt = props.issuedAt;
    this._paidAt = props.paidAt;
    this._method = props.method;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._chargeTitle = props.chargeTitle;
    this._chargeDescription = props.chargeDescription;
  }

  static create(props: StudentFinancialInfoProps): StudentFinancialInfo {
    if (!mongoose.Types.ObjectId.isValid(props.studentId)) {
      throw new Error(FinancialErrorType.InvalidStudentId);
    }
    if (!mongoose.Types.ObjectId.isValid(props.chargeId)) {
      throw new Error(FinancialErrorType.InvalidChargeId);
    }
    if (props.amount <= 0) {
      throw new Error(FinancialErrorType.InvalidAmount);
    }
    if (!["Paid", "Pending"].includes(props.status)) {
      throw new Error(FinancialErrorType.InvalidStatus);
    }
    if (!props.term) {
      throw new Error(FinancialErrorType.MissingRequiredFields);
    }
    return new StudentFinancialInfo(props);
  }

  get id(): mongoose.Types.ObjectId | undefined { return this._id; }
  get studentId(): string { return this._studentId; }
  get chargeId(): string { return this._chargeId; }
  get amount(): number { return this._amount; }
  get paymentDueDate(): Date { return this._paymentDueDate; }
  get status(): "Paid" | "Pending" { return this._status; }
  get term(): string { return this._term; }
  get issuedAt(): Date { return this._issuedAt; }
  get paidAt(): Date | undefined { return this._paidAt; }
  get method(): string | undefined { return this._method; }
  get createdAt(): Date | undefined { return this._createdAt; }
  get updatedAt(): Date | undefined { return this._updatedAt; }
  get chargeTitle(): string | undefined { return this._chargeTitle; }
  get chargeDescription(): string | undefined { return this._chargeDescription; }

  updateStatus(status: "Paid" | "Pending", method?: string, paidAt?: Date): void {
    if (!["Paid", "Pending"].includes(status)) {
      throw new Error(FinancialErrorType.InvalidStatus);
    }
    this._status = status;
    if (status === "Paid") {
      this._method = method;
      this._paidAt = paidAt || new Date();
    }
  }
}