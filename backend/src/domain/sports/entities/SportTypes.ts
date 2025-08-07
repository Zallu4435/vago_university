export enum SportStatus {
  Active = "active",
  Inactive = "inactive",
}

export enum SportRequestStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

export interface SportProps {
  id?: string;
  title: string;
  type: string;
  category: string;
  organizer: string;
  organizerType: string;
  icon: string;
  color: string;
  division: string;
  headCoach: string;
  homeGames: number;
  record: string;
  upcomingGames: { date: string; description: string }[];
  participants: number;
  status?: SportStatus;
  createdAt?: Date;
  updatedAt?: Date;
  playerCount?: number;
  formedOn?: string;
  logo?: string;
}

export interface SportRequestProps {
  id?: string;
  sportId: string;
  userId: string;
  status?: SportRequestStatus;
  whyJoin: string;
  additionalInfo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for Mongoose model
export interface Sport {
  id?: string;
  title: string;
  type: string;
  category: string;
  organizer: string;
  organizerType: string;
  icon: string;
  color: string;
  division: string;
  headCoach: string;
  homeGames: number;
  record: string;
  upcomingGames: { date: string; description: string }[];
  participants: number;
  status: SportStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for Mongoose SportRequest model
export interface SportRequest {
  _id: string;
  sportId: string;
  userId: string;
  status: SportRequestStatus;
  whyJoin: string;
  additionalInfo: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateSportProps = Omit<SportProps, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSportProps = Partial<Omit<SportProps, 'createdAt' | 'updatedAt'>> & { id: string };
export type CreateSportRequestProps = Omit<SportRequestProps, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSportRequestProps = Partial<Omit<SportRequestProps, 'createdAt' | 'updatedAt'>> & { id: string };