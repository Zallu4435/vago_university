import { Document } from "mongoose";

export interface CourseProps {
  id?: string;
  title: string;
  specialization: string;
  faculty: string;
  credits: number;
  schedule: string;
  maxEnrollment: number;
  currentEnrollment?: number;
  description?: string;
  term?: string;
  prerequisites?: string[];
}

export enum EnrollmentStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

export interface EnrollmentProps {
  id?: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  requestedAt?: Date;
  reason?: string;
}

export interface ICourseDocument extends Document {
  title: string;
  specialization: string;
  faculty: string;
  credits: number;
  schedule: string;
  maxEnrollment: number;
  currentEnrollment: number;
  description?: string;
  term?: string;
  prerequisites?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IEnrollmentDocument extends Document {
  studentId: string; 
  courseId: string;  
  status: "Pending" | "Approved" | "Rejected";
  requestedAt: Date;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
} 