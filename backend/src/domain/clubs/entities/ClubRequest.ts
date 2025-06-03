import { ClubErrorType } from "../enums/ClubErrorType";

export enum ClubRequestStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

interface ClubRequestProps {
  id?: string;
  clubId: string;
  userId: string;
  status: ClubRequestStatus;
  whyJoin: string;
  additionalInfo?: string;
}

export class ClubRequest {
  private id?: string;
  private clubId: string;
  private userId: string;
  private status: ClubRequestStatus;
  private whyJoin: string;
  private additionalInfo: string;

  constructor(props: ClubRequestProps) {
    this.id = props.id;
    this.clubId = props.clubId;
    this.userId = props.userId;
    this.status = props.status;
    this.whyJoin = props.whyJoin;
    this.additionalInfo = props.additionalInfo || "";
  }

  static create(props: ClubRequestProps): ClubRequest {
    if (!props.clubId) {
      throw new Error(ClubErrorType.InvalidClubId);
    }
    if (!props.userId) {
      throw new Error(ClubErrorType.InvalidUserId);
    }
    if (!props.whyJoin || props.whyJoin.trim().length === 0) {
      throw new Error(ClubErrorType.InvalidWhyJoin);
    }
    return new ClubRequest(props);
  }

  get id(): string | undefined { return this.id; }
  get clubId(): string { return this.clubId; }
  get userId(): string { return this.userId; }
  get status(): ClubRequestStatus { return this.status; }
  get whyJoin(): string { return this.whyJoin; }
  get additionalInfo(): string { return this.additionalInfo; }
}