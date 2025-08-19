import { AssignmentFile } from '../assignmenttypes';
import { Submission } from './Submission';

export enum AssignmentStatus {
  Draft = 'draft',
  Published = 'published',
  Closed = 'closed'
}

export interface IAssignment {
  _id?: string;
  title: string;
  subject: string;
  description: string;
  maxMarks: number;
  dueDate: Date;
  files: AssignmentFile[];
  status: AssignmentStatus;
  createdAt?: Date;
  updatedAt?: Date;
  totalSubmissions?: number;
  averageMarks?: number;
}

export class Assignment implements IAssignment {
  _id?: string;
  title: string;
  subject: string;
  description: string;
  maxMarks: number;
  dueDate: Date;
  files: AssignmentFile[];
  status: AssignmentStatus;
  createdAt?: Date;
  updatedAt?: Date;
  totalSubmissions: number;
  averageMarks: number;

  constructor(props: IAssignment) {
    this._id = props._id;
    this.title = props.title;
    this.subject = props.subject;
    this.description = props.description;
    this.maxMarks = props.maxMarks;
    this.dueDate = props.dueDate;
    this.files = props.files || [];
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.totalSubmissions = props.totalSubmissions || 0;
    this.averageMarks = props.averageMarks || 0;
  }

  static create(props: {
    title: string;
    subject: string;
    dueDate: Date;
    maxMarks: number;
    description: string;
    files: AssignmentFile[];
    status?: AssignmentStatus;
  }): Assignment {
    const now = new Date();
    return new Assignment({
      title: props.title,
      subject: props.subject,
      dueDate: props.dueDate,
      maxMarks: props.maxMarks,
      description: props.description,
      files: props.files,
      status: props.status || AssignmentStatus.Draft,
      totalSubmissions: 0,
      averageMarks: 0,
      createdAt: now,
      updatedAt: now
    });
  }

  static fromExisting(props: {
    _id: string;
    title: string;
    subject: string;
    dueDate: Date;
    maxMarks: number;
    description: string;
    files: AssignmentFile[];
    createdAt: Date;
    updatedAt: Date;
    status: AssignmentStatus;
    totalSubmissions: number;
    averageMarks?: number;
  }): Assignment {
    return new Assignment({
      _id: props._id,
      title: props.title,
      subject: props.subject,
      dueDate: props.dueDate,
      maxMarks: props.maxMarks,
      description: props.description,
      files: props.files,
      status: props.status,
      totalSubmissions: props.totalSubmissions,
      averageMarks: props.averageMarks,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt
    });
  }

  static createAssignmentList(props: {
    assignments: Assignment[];
    total: number;
    page: number;
    limit: number;
  }) {
    return {
      assignments: props.assignments,
      total: props.total,
      page: props.page,
      limit: props.limit
    };
  }

  static createAssignmentResponse(assignment: Assignment) {
    return assignment;
  }

  static createSubmissionList(props: {
    submissions: Submission[];
    total: number;
    page: number;
    limit: number;
  }) {
    return {
      submissions: props.submissions,
      total: props.total,
      page: props.page,
      limit: props.limit
    };
  }

  static createSubmissionResponse(submission: Submission) {
    return submission;
  }

  static createAnalyticsResponse(props: {
    totalAssignments: number;
    totalSubmissions: number;
    submissionRate: number;
    averageSubmissionTimeHours: number;
    subjectDistribution: Record<string, number>;
    statusDistribution: Record<string, number>;
    recentSubmissions: Array<{
      assignmentTitle: string;
      studentName: string;
      submittedAt: Date;
      score: number;
    }>;
    topPerformers: Array<{
      studentId: string;
      studentName: string;
      averageScore: number;
      submissionsCount: number;
    }>;
  }) {
    return props;
  }

  update(props: {
    title?: string;
    subject?: string;
    dueDate?: Date;
    maxMarks?: number;
    description?: string;
    files?: AssignmentFile[];
    status?: AssignmentStatus;
  }): void {
    if (props.title !== undefined) this.title = props.title;
    if (props.subject !== undefined) this.subject = props.subject;
    if (props.dueDate !== undefined) this.dueDate = props.dueDate;
    if (props.maxMarks !== undefined) this.maxMarks = props.maxMarks;
    if (props.description !== undefined) this.description = props.description;
    if (props.files !== undefined) this.files = props.files;
    if (props.status !== undefined) this.status = props.status;

    this.updatedAt = new Date();
  }

  updateStats(totalSubmissions: number, averageMarks?: number): void {
    this.totalSubmissions = totalSubmissions;
    this.averageMarks = averageMarks;
    this.updatedAt = new Date();
  }
}

export interface AssignmentFilter {
  subject?: string;
  status?: string;
  title?: { $regex: string; $options: string };
  $or?: Array<{
    title?: { $regex: string; $options: string };
    subject?: { $regex: string; $options: string };
  }>;
  [key: string]: unknown;
}


export interface UserAssignmentFilter {
  subject?: string;
  status?: string;
  dueDate?: { $gte?: Date; $lte?: Date };
  priority?: number;
  title?: { $regex: string; $options: string };
  $or?: Array<{
    title?: { $regex: string; $options: string };
    subject?: { $regex: string; $options: string };
  }>;
  [key: string]: unknown;
}


export type SubmissionFilterOrClause =
  | { studentName: RegExp }
  | { feedback: RegExp }
  | { 'files.fileName': RegExp };

export type SubmissionFilter = {
  assignmentId: string;
  status?: string;
  $or?: SubmissionFilterOrClause[];
};

export type SubmissionSort = {
  submittedDate?: 1 | -1;
};