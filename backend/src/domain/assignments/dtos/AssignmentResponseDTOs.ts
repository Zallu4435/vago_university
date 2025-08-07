import { AssignmentFile, SubmissionFile, SubmissionStatus } from '../assignmenttypes';

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
  averageMarks?: number;
}

export interface SubmissionDTO {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedDate: Date;
  status: 'pending' | 'reviewed' | 'late';
  marks?: number;
  feedback?: string;
  isLate: boolean;
  files: SubmissionFile[];
}

export interface PaginationDTO {
  total: number;
  page: number;
  limit: number;
}

export interface GetAssignmentsResponseDTO extends PaginationDTO {
  assignments: AssignmentDTO[];
}

export interface GetAssignmentResponseDTO {
  assignment: AssignmentDTO;
}

export interface CreateAssignmentResponseDTO {
  assignment: AssignmentDTO;
}

export interface UpdateAssignmentResponseDTO {
  assignment: AssignmentDTO;
}

export interface GetSubmissionsResponseDTO extends PaginationDTO {
  submissions: SubmissionDTO[];
}

export interface GetSubmissionResponseDTO {
  submission: SubmissionDTO;
}

export interface ReviewSubmissionResponseDTO {
  submission: SubmissionDTO;
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