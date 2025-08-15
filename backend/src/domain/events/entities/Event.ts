import { EventErrorType } from "../enums/EventErrorType";
import { 
  EventProps, 
  OrganizerType, 
  EventType, 
  Timeframe, 
  EventStatus 
} from "./EventTypes";

// DTOs for repository operations
export interface CreateEventDto {
  title: string;
  organizer: string;
  organizerType: OrganizerType;
  eventType: EventType;
  date: string;
  time: string;
  location: string;
  timeframe: Timeframe;
  status?: EventStatus;
  icon?: string;
  color?: string;
  description?: string;
  fullTime?: boolean;
  additionalInfo?: string;
  requirements?: string;
  maxParticipants?: number;
  registrationRequired?: boolean;
  participants?: number;
}

export interface UpdateEventDto {
  title?: string;
  organizer?: string;
  organizerType?: OrganizerType;
  eventType?: EventType;
  date?: string;
  time?: string;
  location?: string;
  timeframe?: Timeframe;
  status?: EventStatus;
  icon?: string;
  color?: string;
  description?: string;
  fullTime?: boolean;
  additionalInfo?: string;
  requirements?: string;
  maxParticipants?: number;
  registrationRequired?: boolean;
  participants?: number;
}

// Filter type for MongoDB queries
export interface EventFilter {
  eventType?: { $regex: string; $options: string } | string;
  status?: { $regex: string; $options: string } | string;
  organizerType?: { $regex: string; $options: string } | string;
  date?: { $gte?: string; $lte?: string } | string;
  $or?: Array<{
    title?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
    organizer?: { $regex: string; $options: string };
    location?: { $regex: string; $options: string };
  }>;
}

// Event Request DTOs
export interface CreateEventRequestDto {
  eventId: string;
  userId: string;
  status: string;
  whyJoin: string;
  additionalInfo?: string;
}

export interface UpdateEventRequestDto {
  status?: string;
  whyJoin?: string;
  additionalInfo?: string;
}

// Filter type for event request queries
export interface EventRequestFilter {
  status?: { $regex: string; $options: string } | string;
  eventId?: string;
  userId?: string;
  createdAt?: { $gte?: Date; $lte?: Date };
  $or?: Array<{
    whyJoin?: { $regex: string; $options: string };
    additionalInfo?: { $regex: string; $options: string };
  }>;
}

// Response types matching repository returns
export interface PaginatedResponse<T> {
  events: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface EventSummary {
  _id: string;
  title: string;
  organizerType: string;
  eventType: string;
  location: string;
  timeframe: string;
  status: string;
}

export interface SimplifiedEventRequest {
  eventName: string;
  requestedId: string;
  requestedBy: string;
  type: string;
  requestedDate: string;
  status: string;
  proposedDate: string;
}

export interface EventRequestDetails {
  _id: string;
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  whyJoin: string;
  additionalInfo: string;
  eventId: {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    participantsCount: number;
  };
  userId?: {
    _id: string;
    name: string;
    email: string;
  };
}

// Populated user type for event requests
export interface PopulatedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Event document type (from Mongoose, with all fields)
export interface EventDocument {
  _id: string;
  title: string;
  organizer: string;
  organizerType: string;
  eventType: string;
  date: string;
  time: string;
  location: string;
  timeframe: string;
  icon: string;
  color: string;
  description: string;
  fullTime: boolean;
  additionalInfo: string;
  requirements: string;
  status: string;
  maxParticipants: number;
  registrationRequired: boolean;
  participants: number;
  createdAt: Date;
  updatedAt: Date;
}

// EventRequest document type (with populated eventId and userId)
export interface EventRequestDocument {
  _id: string;
  eventId: EventDocument | string;
  userId: PopulatedUser | string;
  status: string;
  whyJoin: string;
  additionalInfo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventsListResponse {
  events: EventDocument[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface EventRequestsListResponse {
  rawRequests: EventRequestDocument[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export { OrganizerType, EventType, Timeframe, EventStatus };

export class Event {
  private _id?: string;
  private _title: string;
  private _organizer: string;
  private _organizerType: OrganizerType;
  private _eventType: EventType;
  private _date: string;
  private _time: string;
  private _location: string;
  private _timeframe: Timeframe;
  private _status: EventStatus;
  private _icon: string;
  private _color: string;
  private _description: string;
  private _fullTime: boolean;
  private _additionalInfo: string;
  private _requirements: string;
  private _maxParticipants: number;
  private _registrationRequired: boolean;
  private _participants: number;

  constructor(props: EventProps) {
    this._id = props.id;
    this._title = props.title;
    this._organizer = props.organizer;
    this._organizerType = props.organizerType;
    this._eventType = props.eventType;
    this._date = props.date;
    this._time = props.time;
    this._location = props.location;
    this._timeframe = props.timeframe;
    this._status = props.status || EventStatus.Upcoming;
    this._icon = props.icon || "📅";
    this._color = props.color || "#8B5CF6";
    this._description = props.description || "";
    this._fullTime = props.fullTime || false;
    this._additionalInfo = props.additionalInfo || "";
    this._requirements = props.requirements || "";
    this._maxParticipants = props.maxParticipants || 0;
    this._registrationRequired = props.registrationRequired || false;
    this._participants = props.participants || 0;
  }

  static create(props: EventProps): Event {
    if (!props.title || props.title.length < 3) {
      throw new Error(EventErrorType.InvalidTitle);
    }
    if (!props.organizer || props.organizer.length < 2) {
      throw new Error(EventErrorType.InvalidOrganizer);
    }
    if (!props.location || props.location.length < 3) {
      throw new Error(EventErrorType.InvalidLocation);
    }
    return new Event(props);
  }

  get id(): string | undefined { return this._id; }
  get title(): string { return this._title; }
  get organizer(): string { return this._organizer; }
  get organizerType(): OrganizerType { return this._organizerType; }
  get eventType(): EventType { return this._eventType; }
  get date(): string { return this._date; }
  get time(): string { return this._time; }
  get location(): string { return this._location; }
  get timeframe(): Timeframe { return this._timeframe; }
  get status(): EventStatus { return this._status; }
  get icon(): string { return this._icon; }
  get color(): string { return this._color; }
  get description(): string { return this._description; }
  get fullTime(): boolean { return this._fullTime; }
  get additionalInfo(): string { return this._additionalInfo; }
  get requirements(): string { return this._requirements; }
  get maxParticipants(): number { return this._maxParticipants; }
  get registrationRequired(): boolean { return this._registrationRequired; }
  get participants(): number { return this._participants; }

  toPersistence() {
    return {
      title: this._title,
      organizer: this._organizer,
      organizerType: this._organizerType,
      eventType: this._eventType,
      date: this._date,
      time: this._time,
      location: this._location,
      timeframe: this._timeframe,
      status: this._status,
      icon: this._icon,
      color: this._color,
      description: this._description,
      fullTime: this._fullTime,
      additionalInfo: this._additionalInfo,
      requirements: this._requirements,
      maxParticipants: this._maxParticipants,
      registrationRequired: this._registrationRequired,
      participants: this._participants,
    };
  }
}

export interface EventFilter {
  title?: string | { $regex: string; $options: string };
  description?: string | { $regex: string; $options: string };
  eventType?: string | { $regex: string; $options: string };
  organizer?: string | { $regex: string; $options: string };
  organizerType?: string | { $regex: string; $options: string };
  location?: string | { $regex: string; $options: string };
  additionalInfo?: string | { $regex: string; $options: string };
  status?: string | { $regex: string; $options: string };
  eventId?: string | { $in: string[] };
  userId?: string | { $in: string[] };
  date?: { $gte?: string; $lte?: string } | string;
  createdAt?: { $gte?: Date; $lte?: Date };
  updatedAt?: { $gte?: Date; $lte?: Date };
  $or?: Array<{
    title?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
    organizer?: { $regex: string; $options: string };
    location?: { $regex: string; $options: string };
    additionalInfo?: { $regex: string; $options: string };
    eventType?: { $regex: string; $options: string };
    organizerType?: { $regex: string; $options: string };
  }>;
  [key: string]: unknown;
}
