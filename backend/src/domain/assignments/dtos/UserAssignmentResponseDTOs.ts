import { Assignment } from '../entities/Assignment';
import { Submission } from '../entities/Submission';
import { AssignmentStatus, Pagination } from '../assignmenttypes';
import type { AssignmentWithSubmission } from '../assignmenttypes';

export interface GetUserAssignmentsResponseDTO extends Pagination {
  assignments: AssignmentWithSubmission[];
}

export interface GetUserAssignmentResponseDTO {
  assignment: AssignmentWithSubmission;
}

export interface SubmitUserAssignmentResponseDTO {
  submission: Submission;
}

export interface GetUserAssignmentStatusResponseDTO {
  status: AssignmentStatus;
  submittedAt?: Date;
  score?: number;
}

export interface GetUserAssignmentFeedbackResponseDTO {
  feedback: string;
  score: number;
  reviewedAt: Date;
} 