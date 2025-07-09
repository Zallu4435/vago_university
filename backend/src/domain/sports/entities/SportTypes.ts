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
  headCoach: string;
  playerCount: number;
  status?: SportStatus;
  formedOn: string;
  logo: string;
  division?: string;
  participants?: number;
  icon?: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  _id: string;
  title: string;
  type: string;
  headCoach: string;
  playerCount: number;
  status: SportStatus;
  formedOn: string;
  logo: string;
  division: string;
  participants: number;
  icon: string;
  color: string;
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