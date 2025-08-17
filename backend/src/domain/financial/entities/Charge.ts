import mongoose from "mongoose";
import { FinancialErrorType } from "../enums/FinancialErrorType";
import { ChargeProps } from "../financialtypes";

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
    this._dueDate = new Date(props.dueDate);
    this._applicableFor = props.applicableFor;
    this._createdBy = props.createdBy;
    this._createdAt = props.createdAt ? new Date(props.createdAt) : undefined;
    this._updatedAt = props.updatedAt ? new Date(props.updatedAt) : undefined;
    this._status = props.status || "Active";
  }

  static create(props: ChargeProps): Charge {
    if (!props.title || !props.description || !props.term || !props.applicableFor) {
      throw new Error(FinancialErrorType.MissingRequiredFields);
    }
    if (props.amount <= 0) {
      throw new Error(FinancialErrorType.InvalidAmount);
    }
    if (!props.dueDate || isNaN(new Date(props.dueDate).getTime())) {
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

export interface ChargeFilter {
  title?: string | { $regex: string; $options: string };
  description?: string | { $regex: string; $options: string };
  term?: string | { $regex: string; $options: string };
  applicableFor?: string | { $regex: string; $options: string };
  status?: string;
  _id?: string | { $in: string[] };
  [key: string]: unknown;
}
