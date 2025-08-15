import { NotificationProps, NotificationStatus, NotificationRecipientType } from "./NotificationTypes";
import { NotificationErrorType } from "../enums/NotificationErrorType";

export class Notification {
    private _id?: string;
    private _title: string;
    private _message: string;
    private _recipientType: NotificationRecipientType;
    private _recipientId?: string;
    private _recipientName?: string;
    private _createdBy: string;
    private _createdAt?: Date;
    private _status: NotificationStatus;

    constructor(props: NotificationProps) {
        this._id = props.id;
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
        if (!Object.values(NotificationRecipientType).includes(props.recipientType)) {
            throw new Error(NotificationErrorType.InvalidRecipientType);
        }
        if (props.recipientType === NotificationRecipientType.INDIVIDUAL && !props.recipientId) {
            throw new Error(NotificationErrorType.InvalidRecipientId);
        }
        return new Notification(props);
    }

    static update(existingProps: NotificationProps, updates: Partial<NotificationProps>): Notification {
        const updatedProps = { ...existingProps, ...updates };
        return new Notification(updatedProps);
    }

    get props(): NotificationProps {
        return {
            id: this._id,
            title: this._title,
            message: this._message,
            recipientType: this._recipientType,
            recipientId: this._recipientId,
            recipientName: this._recipientName,
            createdBy: this._createdBy,
            createdAt: this._createdAt,
            status: this._status,
        };
    }

    get id(): string | undefined { return this._id; }
    get title(): string { return this._title; }
    get message(): string { return this._message; }
    get recipientType(): NotificationRecipientType { return this._recipientType; }
    get recipientId(): string | undefined { return this._recipientId; }
    get recipientName(): string | undefined { return this._recipientName; }
    get createdBy(): string { return this._createdBy; }
    get createdAt(): Date | undefined { return this._createdAt; }
    get status(): NotificationStatus { return this._status; }

    updateStatus(status: NotificationStatus): void {
        if (!Object.values(NotificationStatus).includes(status)) {
            throw new Error(NotificationErrorType.InvalidStatus);
        }
        this._status = status;
    }
}