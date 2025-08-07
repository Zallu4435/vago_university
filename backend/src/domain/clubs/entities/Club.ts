import { ClubErrorType } from "../enums/ClubErrorType";
import { ClubProps, ClubStatus } from "./ClubTypes";

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

// Request Entity Classes
export class GetClubsRequest {
  constructor(
    public page: number,
    public limit: number,
    public category?: string,
    public status?: string,
    public startDate?: Date,
    public endDate?: Date,
    public search?: string
  ) {}
}

export class GetClubByIdRequest {
  constructor(
    public id: string
  ) {}
}

export class CreateClubRequest {
  constructor(
    public name: string,
    public type: string,
    public createdBy: string,
    public description?: string,
    public members?: string[],
    public color?: string,
    public icon?: string,
    public nextMeeting?: string,
    public about?: string,
    public enteredMembers?: number,
    public upcomingEvents?: { date: string; description: string }[],
    public status?: ClubStatus
  ) {}
}

export class UpdateClubRequest {
  constructor(
    public id: string,
    public name?: string,
    public type?: string,
    public createdBy?: string,
    public description?: string,
    public members?: string[],
    public color?: string,
    public icon?: string,
    public nextMeeting?: string,
    public about?: string,
    public enteredMembers?: number,
    public upcomingEvents?: { date: string; description: string }[],
    public status?: ClubStatus
  ) {}
}

export class DeleteClubRequest {
  constructor(
    public id: string
  ) {}
}

export class GetClubRequestsRequest {
  constructor(
    public page: number,
    public limit: number,
    public status: string,
    public type: string,
    public startDate?: string,
    public endDate?: string,
    public search?: string
  ) {}
}

export class ApproveClubRequestRequest {
  constructor(
    public id: string
  ) {}
}

export class RejectClubRequestRequest {
  constructor(
    public id: string
  ) {}
}

export class GetClubRequestDetailsRequest {
  constructor(
    public id: string
  ) {}
}

export class JoinClubRequest {
  constructor(
    public clubId: string,
    public userId: string,
    public whyJoin: string,
    public additionalInfo?: string
  ) {}
}

// Response Entity Classes
export class ClubSummary {
  constructor(
    public id: string,
    public name: string,
    public type: string,
    public members: string[],
    public color: string,
    public icon: string,
    public status: string,
    public memberCount: number,
    public image?: string
  ) {}
}

export class PaginatedResponse<T> {
  constructor(
    public totalItems: number,
    public totalPages: number,
    public currentPage: number,
    public data: T[]
  ) {}
}

export class GetClubsResponse {
  constructor(
    public clubs: any[],
    public totalItems: number,
    public totalPages: number,
    public currentPage: number
  ) {}
}

export class GetClubByIdResponse {
  constructor(
    public club: any
  ) {}
}

export class CreateClubResponse {
  constructor(
    public club: any
  ) {}
}

export class UpdateClubResponse {
  constructor(
    public club: any
  ) {}
}

export class JoinClubResponse {
  constructor(
    public message: string,
    public club: Club
  ) {}
}

export class LeaveClubResponse {
  constructor(
    public message: string,
    public club: Club
  ) {}
}

export class ClubRequestSummary {
  constructor(
    public id: string,
    public userId: string,
    public userName: string,
    public userEmail: string,
    public clubId: string,
    public clubName: string,
    public clubType: string,
    public clubDescription: string,
    public status: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}

export class GetClubRequestsResponse {
  constructor(
    public rawRequests: any[],
    public totalItems: number,
    public totalPages: number,
    public currentPage: number
  ) {}
}

export class CreateClubRequestResponse {
  constructor(
    public message: string,
    public request: ClubRequestSummary
  ) {}
}

export class ApproveClubRequestResponse {
  constructor(
    public message: string,
    public request: ClubRequestSummary
  ) {}
}

export class RejectClubRequestResponse {
  constructor(
    public message: string,
    public request: ClubRequestSummary
  ) {}
}

export class ClubRequestDetails {
  constructor(
    public id: string,
    public status: string,
    public createdAt: string,
    public updatedAt: string,
    public whyJoin: string,
    public additionalInfo: string,
    public club: {
      id: string;
      name: string;
      type: string;
      about: string;
      nextMeeting: string;
      enteredMembers: number;
    },
    public user?: {
      id: string;
      name: string;
      email: string;
    }
  ) {}
}

export class GetClubRequestDetailsResponse {
  constructor(
    public clubRequest: any
  ) {}
}