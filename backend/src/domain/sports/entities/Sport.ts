import { SportProps, SportStatus } from "./SportTypes";

export class Sport {
  private id?: string;
  private title: string;
  private type: string;
  private headCoach: string;
  private playerCount: number;
  private status: SportStatus;
  private formedOn: string;
  private logo: string;
  private division: string;
  private participants: number;
  private icon: string;
  private color: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(props: SportProps) {
    this.id = props.id;
    this.title = props.title;
    this.type = props.type;
    this.headCoach = props.headCoach;
    this.playerCount = props.playerCount;
    this.status = props.status || SportStatus.Active;
    this.formedOn = props.formedOn;
    this.logo = props.logo;
    this.division = props.division || "";
    this.participants = props.participants || 0;
    this.icon = props.icon || "🏃";
    this.color = props.color || "#4CAF50";
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  getId(): string | undefined {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getType(): string {
    return this.type;
  }

  getHeadCoach(): string {
    return this.headCoach;
  }

  getPlayerCount(): number {
    return this.playerCount;
  }

  getStatus(): SportStatus {
    return this.status;
  }

  getFormedOn(): string {
    return this.formedOn;
  }

  getLogo(): string {
    return this.logo;
  }

  getDivision(): string {
    return this.division;
  }

  getParticipants(): number {
    return this.participants;
  }

  getIcon(): string {
    return this.icon;
  }

  getColor(): string {
    return this.color;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
} 