import mongoose from "mongoose";
import { FinancialErrorType } from "../enums/FinancialErrorType";
import { PaymentProps } from "../financialtypes";

export class Payment {
  private _id?: mongoose.Types.ObjectId;
  private _studentId: string;
  private _date: Date;
  private _description: string;
  private _method: "Credit Card" | "Bank Transfer" | "Financial Aid" | "Razorpay" | "stripe";
  private _amount: number;
  private _status: "Completed" | "Pending" | "Failed";
  private _receiptUrl?: string;
  private _metadata?: Record<string, unknown>;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(props: PaymentProps) {
    this._id = props._id;
    this._studentId = props.studentId;
    this._date = new Date(props.date);
    this._description = props.description;
    this._method = props.method;
    this._amount = props.amount;
    this._status = props.status;
    this._receiptUrl = props.receiptUrl;
    this._metadata = props.metadata;
    this._createdAt = props.createdAt ? new Date(props.createdAt) : undefined;
    this._updatedAt = props.updatedAt ? new Date(props.updatedAt) : undefined;
  }

  static create(props: PaymentProps): Payment {
    if (!mongoose.Types.ObjectId.isValid(props.studentId)) {
      throw new Error(FinancialErrorType.InvalidStudentId);
    }
    if (!props.description || !props.method) {
      throw new Error(FinancialErrorType.MissingRequiredFields);
    }
    if (props.amount <= 0) {
      throw new Error(FinancialErrorType.InvalidAmount);
    }
    if (!["Completed", "Pending", "Failed"].includes(props.status)) {
      throw new Error(FinancialErrorType.InvalidStatus);
    }
    return new Payment(props);
  }

  get id(): mongoose.Types.ObjectId | undefined { return this._id; }
  get studentId(): string { return this._studentId; }
  get date(): Date { return this._date; }
  get description(): string { return this._description; }
  get method(): "Credit Card" | "Bank Transfer" | "Financial Aid" | "Razorpay" | "stripe" { return this._method; }
  get amount(): number { return this._amount; }
  get status(): "Completed" | "Pending" | "Failed" { return this._status; }
  get receiptUrl(): string | undefined { return this._receiptUrl; }
  get metadata(): Record<string, unknown> | undefined { return this._metadata; }
  get createdAt(): Date | undefined { return this._createdAt; }
  get updatedAt(): Date | undefined { return this._updatedAt; }

  updateStatus(status: "Completed" | "Pending" | "Failed"): void {
    if (!["Completed", "Pending", "Failed"].includes(status)) {
      throw new Error(FinancialErrorType.InvalidStatus);
    }
    this._status = status;
  }
}