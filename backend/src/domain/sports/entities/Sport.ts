import { SportProps, SportStatus } from "./SportTypes";

export class Sport {
  private id?: string;
  private title: string;
  private type: string;
  private category: string;
  private organizer: string;
  private organizerType: string;
  private icon: string;
  private color: string;
  private division: string;
  private headCoach: string;
  private homeGames: number;
  private record: string;
  private upcomingGames: { date: string; description: string }[];
  private participants: number;
  private status: SportStatus;
  private createdAt: Date;
  private updatedAt: Date;
  private playerCount?: number;
  private formedOn?: string;
  private logo?: string;

  constructor(props: SportProps) {
    this.id = props.id;
    this.title = props.title;
    this.type = props.type;
    this.category = props.category;
    this.organizer = props.organizer;
    this.organizerType = props.organizerType;
    this.icon = props.icon;
    this.color = props.color;
    this.division = props.division;
    this.headCoach = props.headCoach;
    this.homeGames = props.homeGames;
    this.record = props.record;
    this.upcomingGames = props.upcomingGames;
    this.participants = props.participants;
    this.status = props.status || SportStatus.Active;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.playerCount = props.playerCount;
    this.formedOn = props.formedOn;
    this.logo = props.logo;
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
    return this.playerCount || 0;
  }

  getStatus(): SportStatus {
    return this.status;
  }

  getFormedOn(): string {
    return this.formedOn || "";
  }

  getLogo(): string {
    return this.logo || "";
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