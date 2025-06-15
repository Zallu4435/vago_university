import { Assignment } from '../entities/Assignment';
import { Submission } from '../entities/Submission';

export interface GetAssignmentsResponseDTO {
  assignments: Assignment[];
  total: number;
  page: number;
  limit: number;
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

export interface GetSubmissionsResponseDTO {
  submissions: Submission[];
  total: number;
  page: number;
  limit: number;
}

export interface GetSubmissionResponseDTO {
  submission: Submission;
}

export interface ReviewSubmissionResponseDTO {
  submission: Submission;
}

export interface AnalyticsResponseDTO {
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
} 