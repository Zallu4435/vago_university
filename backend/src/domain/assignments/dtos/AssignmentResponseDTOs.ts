import { Assignment } from '../entities/Assignment';
import { Submission } from '../entities/Submission';
import { Pagination, AnalyticsData } from '../assignmenttypes';

export interface GetAssignmentsResponseDTO extends Pagination {
  assignments: Assignment[];
}

export interface GetAssignmentResponseDTO {
  assignment: Assignment;
}

export interface CreateAssignmentResponseDTO {
  assignment: Assignment;
}

export interface UpdateAssignmentResponseDTO {
  assignment: Assignment;
}

export interface GetSubmissionsResponseDTO extends Pagination {
  submissions: Submission[];
}

export interface GetSubmissionResponseDTO {
  submission: Submission;
}

export interface ReviewSubmissionResponseDTO {
  submission: Submission;
}

export type AnalyticsResponseDTO = AnalyticsData; 