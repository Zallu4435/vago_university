import { EventErrorType } from "../enums/EventErrorType";
import { EventRequestProps, EventRequestStatus } from "./EventTypes";

export class EventRequest {
  private _id?: string;
  private _eventId: string;
  private _userId: string;
  private _status: EventRequestStatus;
  private _whyJoin: string;
  private _additionalInfo: string;

  constructor(props: EventRequestProps) {
    this._id = props.id;
    this._eventId = typeof props.eventId === 'string' ? props.eventId : props.eventId._id;
    this._userId = typeof props.userId === 'string' ? props.userId : props.userId._id;
    this._status = props.status;
    this._whyJoin = props.whyJoin;
    this._additionalInfo = props.additionalInfo || "";
  }

  static create(props: EventRequestProps): EventRequest {
    if (!props.eventId) {
      throw new Error(EventErrorType.InvalidEventId);
    }
    if (!props.userId) {
      throw new Error(EventErrorType.InvalidUserId);
    }
    if (!props.whyJoin || props.whyJoin.trim().length === 0) {
      throw new Error(EventErrorType.InvalidWhyJoin);
    }
    return new EventRequest(props);
  }

  get id(): string | undefined { return this._id; }
  get eventId(): string { return this._eventId; }
  get userId(): string { return this._userId; }
  get status(): EventRequestStatus { return this._status; }
  get whyJoin(): string { return this._whyJoin; }
  get additionalInfo(): string { return this._additionalInfo; }
}