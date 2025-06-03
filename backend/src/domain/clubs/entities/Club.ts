import { ClubErrorType } from "../enums/ClubErrorType";

export enum ClubStatus {
  Active = "active",
  Inactive = "inactive",
}

interface ClubProps {
  id?: string;
  name: string;
  type: string;
  createdBy: string;
  status?: ClubStatus;
  description?: string;
  members?: string[];
  color?: string;
  icon?: string;
  nextMeeting?: string;
  about?: string;
  enteredMembers?: number;
  upcomingEvents?: { date: string; description: string }[];
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Club {
  private id?: string;
  private name: string;
  private type: string;
  private createdBy: string;
  private status: ClubStatus;
  private description: string;
  private members: string[];
  private color: string;
  private icon: string;
  private nextMeeting: string;
  private about: string;
  private enteredMembers: number;
  private upcomingEvents: { date: string; description: string }[];
  private role: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(props: ClubProps) {
    this.id = props.id;
    this.name = props.name;
    this.type = props.type;
    this.createdBy = props.createdBy;
    this.status = props.status || ClubStatus.Active;
    this.description = props.description || "";
    this.members = props.members || [];
    this.color = props.color || "#8B5CF6";
    this.icon = props.icon || "🎓";
    this.nextMeeting = props.nextMeeting || "";
    this.about = props.about || "";
    this.enteredMembers = props.enteredMembers || 0;
    this.upcomingEvents = props.upcomingEvents || [];
    this.role = props.role || "";
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  static create(props: ClubProps): Club {
    if (!props.name || props.name.length < 3) {
      throw new Error(ClubErrorType.InvalidClubName);
    }
    if (!props.type || props.type.length < 3) {
      throw new Error(ClubErrorType.InvalidClubType);
    }
    if (!props.createdBy) {
      throw new Error(ClubErrorType.InvalidCreatedBy);
    }
    return new Club(props);
  }

  getId(): string | undefined {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getType(): string {
    return this.type;
  }

  getCreatedBy(): string {
    return this.createdBy;
  }

  getStatus(): ClubStatus {
    return this.status;
  }

  getDescription(): string {
    return this.description;
  }

  getMembers(): string[] {
    return this.members;
  }

  getColor(): string {
    return this.color;
  }

  getIcon(): string {
    return this.icon;
  }

  getNextMeeting(): string {
    return this.nextMeeting;
  }

  getAbout(): string {
    return this.about;
  }

  getEnteredMembers(): number {
    return this.enteredMembers;
  }

  getUpcomingEvents(): { date: string; description: string }[] {
    return this.upcomingEvents;
  }

  getRole(): string {
    return this.role;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}