import { PopulatedUser } from "../../events/entities/Event";

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

export interface SportDocument {
  _id: string;
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
  id?: string;
  logo?: string;
}

export type SportLeanResult = {
  _id: string; 
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
  id?: string;
  logo?: string;
};

export interface SportRequest {
  _id: string;
  sportId: string | SportDocument;
  userId: string | PopulatedUser;
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

// Types for repository operations
export type CreateSportData = {
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
  playerCount?: number;
  formedOn?: string;
  logo?: string;
};

export type UpdateSportData = Partial<Omit<CreateSportData, 'status'>> & { id: string };

export interface SportFilter {
  type?: string | { $regex: string; $options: string };
  status?: SportStatus | string | { $regex: string; $options: string };
  coach?: string;
  headCoach?: string | { $regex: string; $options: string };
  category?: string;
  organizer?: string;
  organizerType?: string;
  division?: string;
  sportId?: string | { $in: string[] };
  userId?: string | { $in: string[] };
  createdAt?: { $gte?: Date; $lte?: Date };
  updatedAt?: { $gte?: Date; $lte?: Date };
  $or?: Array<{
    title?: { $regex: string; $options: string };
    headCoach?: { $regex: string; $options: string };
    organizer?: { $regex: string; $options: string };
    category?: { $regex: string; $options: string };
    type?: { $regex: string; $options: string };
    division?: { $regex: string; $options: string };
    sportId?: { $in: string[] };
    userId?: { $in: string[] };
  }>;
  [key: string]: unknown;
}
