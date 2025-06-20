import mongoose from "mongoose";
import { FinancialErrorType } from "../enums/FinancialErrorType";

export interface ChargeProps {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  amount: number;
  term: string;
  dueDate: Date;
  applicableFor: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: "Active" | "Inactive";
}

export class Charge {
  private _id?: mongoose.Types.ObjectId;
  private _title: string;
  private _description: string;
  private _amount: number;
  private _term: string;
  private _dueDate: Date;
  private _applicableFor: string;
  private _createdBy?: string;
  private _createdAt?: Date;
  private _updatedAt?: Date;
  private _status?: "Active" | "Inactive";

  constructor(props: ChargeProps) {
    this._id = props._id;
    this._title = props.title;
    this._description = props.description;
    this._amount = props.amount;
    this._term = props.term;
    this._dueDate = props.dueDate;
    this._applicableFor = props.applicableFor;
    this._createdBy = props.createdBy;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._status = props.status || "Active";
  }

  static create(props: ChargeProps): Charge {
    if (!props.title || !props.description || !props.term || !props.applicableFor) {
      throw new Error(FinancialErrorType.MissingRequiredFields);
    }
    if (props.amount <= 0) {
      throw new Error(FinancialErrorType.InvalidAmount);
    }
    if (!(props.dueDate instanceof Date) || isNaN(props.dueDate.getTime())) {
      throw new Error(FinancialErrorType.InvalidDueDate);
    }
    return new Charge(props);
  }

  get id(): mongoose.Types.ObjectId | undefined { return this._id; }
  get title(): string { return this._title; }
  get description(): string { return this._description; }
  get amount(): number { return this._amount; }
  get term(): string { return this._term; }
  get dueDate(): Date { return this._dueDate; }
  get applicableFor(): string { return this._applicableFor; }
  get createdBy(): string | undefined { return this._createdBy; }
  get createdAt(): Date | undefined { return this._createdAt; }
  get updatedAt(): Date | undefined { return this._updatedAt; }
  get status(): "Active" | "Inactive" | undefined { return this._status; }
}