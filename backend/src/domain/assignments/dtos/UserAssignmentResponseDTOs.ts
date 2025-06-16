import { Assignment } from '../entities/Assignment';
import { Submission } from '../entities/Submission';

export interface GetUserAssignmentsResponseDTO {
  assignments: Assignment[];
  total: number;
  page: number;
  limit: number;
}

export interface GetUserAssignmentResponseDTO {
  assignment: Assignment;
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