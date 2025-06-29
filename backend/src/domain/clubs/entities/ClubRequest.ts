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
  private idValue?: string;
  private clubIdValue: string;
  private userIdValue: string;
  private statusValue: ClubRequestStatus;
  private whyJoinValue: string;
  private additionalInfoValue: string;

  constructor(props: ClubRequestProps) {
    this.idValue = props.id;
    this.clubIdValue = props.clubId;
    this.userIdValue = props.userId;
    this.statusValue = props.status;
    this.whyJoinValue = props.whyJoin;
    this.additionalInfoValue = props.additionalInfo || "";
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

  get id(): string | undefined { return this.idValue; }
  get clubId(): string { return this.clubIdValue; }
  get userId(): string { return this.userIdValue; }
  get status(): ClubRequestStatus { return this.statusValue; }
  get whyJoin(): string { return this.whyJoinValue; }
  get additionalInfo(): string { return this.additionalInfoValue; }
}