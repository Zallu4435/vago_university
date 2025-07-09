import { SportRequestProps, SportRequestStatus } from "./SportTypes";

export class SportRequest {
  private id?: string;
  private sportId: string;
  private userId: string;
  private status: SportRequestStatus;
  private whyJoin: string;
  private additionalInfo: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(props: SportRequestProps) {
    this.id = props.id;
    this.sportId = props.sportId;
    this.userId = props.userId;
    this.status = props.status || SportRequestStatus.Pending;
    this.whyJoin = props.whyJoin;
    this.additionalInfo = props.additionalInfo || "";
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  getId(): string | undefined {
    return this.id;
  }

  getSportId(): string {
    return this.sportId;
  }

  getUserId(): string {
    return this.userId;
  }

  getStatus(): SportRequestStatus {
    return this.status;
  }

  getWhyJoin(): string {
    return this.whyJoin;
  }

  getAdditionalInfo(): string {
    return this.additionalInfo;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
} 