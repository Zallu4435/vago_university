import mongoose from "mongoose";
import { FinancialErrorType } from "../enums/FinancialErrorType";

export interface ScholarshipProps {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  amount: number;
  deadline: Date;
  requirements: string[];
  status: "Open" | "Closed";
  term: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Scholarship {
  private _id?: mongoose.Types.ObjectId;
  private _name: string;
  private _description: string;
  private _amount: number;
  private _deadline: Date;
  private _requirements: string[];
  private _status: "Open" | "Closed";
  private _term: string;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(props: ScholarshipProps) {
    this._id = props._id;
    this._name = props.name;
    this._description = props.description;
    this._amount = props.amount;
    this._deadline = props.deadline;
    this._requirements = props.requirements;
    this._status = props.status;
    this._term = props.term;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: ScholarshipProps): Scholarship {
    if (!props.name || !props.description || !props.term) {
      throw new Error(FinancialErrorType.MissingRequiredFields);
    }
    if (props.amount <= 0) {
      throw new Error(FinancialErrorType.InvalidAmount);
    }
    if (!["Open", "Closed"].includes(props.status)) {
      throw new Error(FinancialErrorType.InvalidStatus);
    }
    return new Scholarship(props);
  }

  get id(): mongoose.Types.ObjectId | undefined { return this._id; }
  get name(): string { return this._name; }
  get description(): string { return this._description; }
  get amount(): number { return this._amount; }
  get deadline(): Date { return this._deadline; }
  get requirements(): string[] { return this._requirements; }
  get status(): "Open" | "Closed" { return this._status; }
  get term(): string { return this._term; }
  get createdAt(): Date | undefined { return this._createdAt; }
  get updatedAt(): Date | undefined { return this._updatedAt; }
}