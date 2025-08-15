import { Document } from "mongoose";

export enum EnquiryStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

export interface EnquiryProps {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEnquiry extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateEnquiryProps = Omit<EnquiryProps, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEnquiryProps = Partial<Omit<EnquiryProps, 'createdAt' | 'updatedAt'>> & { id: string }; 