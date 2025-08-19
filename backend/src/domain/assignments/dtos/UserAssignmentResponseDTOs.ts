import { AssignmentFile, SubmissionFile } from '../assignmenttypes';

export interface AssignmentDTO {
  _id: string;
  title: string;
  subject: string;
  dueDate: Date;
  maxMarks: number;
  description: string;
  files: AssignmentFile[];
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'closed';
  totalSubmissions: number;
}

export interface SubmissionDTO {
  id: string;
  studentId: string;
  studentName: string;
  assignmentId: string;
  files: SubmissionFile[];
  submittedDate: Date;
  status: 'pending' | 'reviewed' | 'late' | 'needs_correction';
  marks?: number;
  feedback?: string;
  isLate: boolean;
}

export interface AssignmentWithSubmissionDTO extends AssignmentDTO {
  submission: SubmissionDTO | null;
}

export interface PaginationDTO {
  total: number;
  page: number;
  limit: number;
}

export interface GetUserAssignmentsResponseDTO extends PaginationDTO {
  assignments: AssignmentWithSubmissionDTO[];
}

export interface GetUserAssignmentResponseDTO {
  assignment: AssignmentWithSubmissionDTO;
}

export interface SubmitUserAssignmentResponseDTO {
  submission: SubmissionDTO;
}

export interface GetUserAssignmentStatusResponseDTO {
  status: 'pending' | 'reviewed' | 'late' | 'needs_correction';
  submittedAt?: Date;
  score?: number;
}

export interface GetUserAssignmentFeedbackResponseDTO {
  feedback: string;
  score: number;
  reviewedAt: Date;
} 

export interface ResponseDTO<T> {
  data: T | { error: string };
  success: boolean;
}