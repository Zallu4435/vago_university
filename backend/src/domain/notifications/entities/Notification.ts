import mongoose from "mongoose";
import { NotificationErrorType } from "../enums/NotificationErrorType";

export interface NotificationProps {
    _id?: mongoose.Types.ObjectId;
    title: string;
    message: string;
    recipientType: "individual" | "all_students" | "all_faculty" | "all" | "all_students_and_faculty";
    recipientId?: string;
    recipientName?: string;
    createdBy: string;
    createdAt?: string;
    status: "sent" | "failed";
}

export class Notification {
    private _id?: mongoose.Types.ObjectId;
    private _title: string;
    private _message: string;
    private _recipientType: "individual" | "all_students" | "all_faculty" | "all" | "all_students_and_faculty";
    private _recipientId?: string;
    private _recipientName?: string;
    private _createdBy: string;
    private _createdAt?: string;
    private _status: "sent" | "failed";

    constructor(props: NotificationProps) {
        this._id = props._id;
        this._title = props.title;
        this._message = props.message;
        this._recipientType = props.recipientType;
        this._recipientId = props.recipientId;
        this._recipientName = props.recipientName;
        this._createdBy = props.createdBy;
        this._createdAt = props.createdAt;
        this._status = props.status;
    }

    static create(props: NotificationProps): Notification {
        if (!props.title || !props.message || !props.recipientType || !props.createdBy) {
            throw new Error(NotificationErrorType.MissingRequiredFields);
        }
        if (!["individual", "all_students", "all_faculty", "all", "all_students_and_faculty"].includes(props.recipientType)) {
            throw new Error(NotificationErrorType.InvalidRecipientType);
        }
        if (props.recipientType === "individual" && (!props.recipientId || !mongoose.Types.ObjectId.isValid(props.recipientId))) {
            throw new Error(NotificationErrorType.InvalidRecipientId);
        }
        return new Notification(props);
    }

    get id(): mongoose.Types.ObjectId | undefined { return this._id; }
    get title(): string { return this._title; }
    get message(): string { return this._message; }
    get recipientType(): string { return this._recipientType; }
    get recipientId(): string | undefined { return this._recipientId; }
    get recipientName(): string | undefined { return this._recipientName; }
    get createdBy(): string { return this._createdBy; }
    get createdAt(): string | undefined { return this._createdAt; }
    get status(): "sent" | "failed" { return this._status; }

    updateStatus(status: "sent" | "failed"): void {
        if (!["sent", "failed"].includes(status)) {
            throw new Error(NotificationErrorType.InvalidStatus);
        }
        this._status = status;
    }
}