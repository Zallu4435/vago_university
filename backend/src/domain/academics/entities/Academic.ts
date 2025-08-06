export enum EnrollmentStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export interface IGradeDocument {
  _id: string;
  studentId: string;
  cumulativeGPA: string;
  termGPA: string;
  termName: string;
  creditsEarned: string;
  creditsInProgress: string;
}

export interface ICourseDocument {
  _id: string;
  title: string;
  specialization: string;
  faculty: string;
  credits: number;
  schedule?: string;
  term?: string;
  maxEnrollment: number;
  currentEnrollment: number;
  description?: string;
  prerequisites?: string[];
  createdAt?: string;
}

export interface IAcademicHistoryDocument {
  _id: string;
  userId: string;
  term: string;
  credits: string;
  gpa: string;
  id: number;
}

export interface IProgressDocument {
  _id: string;
  userId: string;
  overallProgress: number;
  totalCredits: number;
  completedCredits: number;
  remainingCredits: number;
  estimatedGraduation: string;
}

export interface IRequirementDocument {
  _id: string;
  userId: string;
  core: { percentage: number; completed: number; total: number };
  elective: { percentage: number; completed: number; total: number };
  general: { percentage: number; completed: number; total: number };
}

export interface IEnrollmentDocument {
  _id: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  requestedAt: string;
  reason?: string;
}

export interface ITranscriptRequestDocument {
  _id: string;
  userId: string;
  deliveryMethod: string;
  requestedAt: string;
  estimatedDelivery: string;
  address?: string;
  email?: string;
}

export interface IUserDocument {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePicture?: string;
}

export interface IProgramDocument {
  _id: string;
  studentId: string;
  degree: string;
  catalogYear: string;
  credits: number;
}

export class Student {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public phone?: string,
    public profilePicture?: string,
    public createdAt?: string,
    public blocked?: boolean,
    public password?: string,
    public passwordChangedAt?: string,
    public fcmTokens?: string[],
  ) { }
}

export class Grade {
  constructor(
    public id: string,
    public userId: string,
    public courseId: string,
    public cumulativeGPA: string,
    public termGPA: string,
    public course: string,
    public termName: string,
    public description: string,
    public creditsEarned: string,
    public creditsInProgress: string,
    public createdAt: string
  ) { }
}

export class Course {
  constructor(
    public id: string,
    public title: string,
    public specialization: string,
    public faculty: string,
    public credits: number,
    public term: string,
    public maxEnrollment: number,
    public currentEnrollment: number,
    public createdAt: string,
    public schedule?: string,
    public description?: string,
    public prerequisites?: string[]
  ) { }
}

export class AcademicHistory {
  constructor(
    public id: number,
    public userId: string,
    public term: string,
    public credits: string,
    public gpa: string,
    public courseId: string
  ) { }
}

export class Program {
  constructor(
    public id: string,
    public userId: string,
    public degree: string,
    public catalogYear: string,
    public createdAt: string
  ) { }
}

export class Progress {
  constructor(
    public id: string,
    public userId: string,
    public overallProgress: number,
    public totalCredits: number,
    public completedCredits: number,
    public remainingCredits: number,
    public estimatedGraduation: string,
    public createdAt: string
  ) { }
}

export class Requirement {
  constructor(
    public id: string,
    public userId: string,
    public core: { percentage: number; completed: number; total: number },
    public elective: { percentage: number; completed: number; total: number },
    public general: { percentage: number; completed: number; total: number },
    public createdAt: string
  ) { }
}

export class Enrollment {
  constructor(
    public id: string,
    public studentId: string,
    public courseId: string,
    public status: EnrollmentStatus,
    public requestedAt: string,
    public reason?: string
  ) { }
}

export class TranscriptRequest {
  constructor(
    public id: string,
    public userId: string,
    public deliveryMethod: string,
    public requestedAt: string,
    public estimatedDelivery: string,
    public address?: string,
    public email?: string
  ) { }
}

export type StudentInfoResult = {
  user: IUserDocument;
  program: IProgramDocument;
  pendingEnrollments: IEnrollmentDocument[];
};