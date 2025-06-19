import { Assignment } from '../entities/Assignment';
import { Submission } from '../entities/Submission';

export interface AssignmentWithSubmission extends Assignment {
  submission: Submission | null;
}

export interface GetUserAssignmentsResponseDTO {
  assignments: AssignmentWithSubmission[];
  total: number;
  page: number;
  limit: number;
}

export interface GetUserAssignmentResponseDTO {
  assignment: AssignmentWithSubmission;
}

export interface SubmitUserAssignmentResponseDTO {
  submission: Submission;
}

export interface GetUserAssignmentStatusResponseDTO {
  status: 'pending' | 'submitted' | 'reviewed';
  submittedAt?: Date;
  score?: number;
}

export interface GetUserAssignmentFeedbackResponseDTO {
  feedback: string;
  score: number;
  reviewedAt: Date;
} 