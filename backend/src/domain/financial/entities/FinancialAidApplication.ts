import mongoose from "mongoose";
import { FinancialErrorType } from "../enums/FinancialErrorType";

export interface Document {
    id: string;
    name: string;
    url: string;
    status: "Verified" | "Pending" | "Rejected";
}

export interface FinancialAidApplicationProps {
    _id?: mongoose.Types.ObjectId;
    studentId: string;
    term: string;
    status: "Approved" | "Pending" | "Rejected";
    amount: number;
    type: "Grant" | "Loan" | "Scholarship";
    applicationDate: Date;
    documents: Document[];
    createdAt?: Date;
    updatedAt?: Date;
}

export class FinancialAidApplication {
    private _id?: mongoose.Types.ObjectId;
    private _studentId: string;
    private _term: string;
    private _status: "Approved" | "Pending" | "Rejected";
    private _amount: number;
    private _type: "Grant" | "Loan" | "Scholarship";
    private _applicationDate: Date;
    private _documents: Document[];
    private _createdAt?: Date;
    private _updatedAt?: Date;

    constructor(props: FinancialAidApplicationProps) {
        this._id = props._id;
        this._studentId = props.studentId;
        this._term = props.term;
        this._status = props.status;
        this._amount = props.amount;
        this._type = props.type;
        this._applicationDate = props.applicationDate;
        this._documents = props.documents;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    static create(props: FinancialAidApplicationProps): FinancialAidApplication {
        if (!mongoose.Types.ObjectId.isValid(props.studentId)) {
            throw new Error(FinancialErrorType.InvalidStudentId);
        }
        if (!props.term || !props.type) {
            throw new Error(FinancialErrorType.MissingRequiredFields);
        }
        if (props.amount <= 0) {
            throw new Error(FinancialErrorType.InvalidAmount);
        }
        if (!["Approved", "Pending", "Rejected"].includes(props.status)) {
            throw new Error(FinancialErrorType.InvalidStatus);
        }
        if (!props.documents.length) {
            throw new Error(FinancialErrorType.MissingDocuments);
        }
        return new FinancialAidApplication(props);
    }

    get id(): mongoose.Types.ObjectId | undefined { return this._id; }
    get studentId(): string { return this._studentId; }
    get term(): string { return this._term; }
    get status(): "Approved" | "Pending" | "Rejected" { return this._status; }
    get amount(): number { return this._amount; }
    get type(): "Grant" | "Loan" | "Scholarship" { return this._type; }
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

    updateAmount(amount: number): void {
        if (amount <= 0) {
            throw new Error(FinancialErrorType.InvalidAmount);
        }
        this._amount = amount;
    }
}