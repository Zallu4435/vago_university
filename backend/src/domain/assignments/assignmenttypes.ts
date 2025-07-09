import { Assignment } from './entities/Assignment';
import { Submission } from './entities/Submission';

export interface AssignmentFile {
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

export enum SubmissionStatus {
  Pending = 'pending',
  Reviewed = 'reviewed',
  Late = 'late'
}

export interface SubmissionFile {
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

export type AssignmentStatus = 'draft' | 'published' | 'closed' | 'pending' | 'submitted' | 'reviewed' | 'graded' | 'all';

export interface Pagination {
  total: number;
  page: number;
  limit: number;
}

export interface AnalyticsRecentSubmission {
  assignmentTitle: string;
  studentName: string;
  submittedAt: Date;
  score: number;
}

export interface AnalyticsTopPerformer {
  studentId: string;
  studentName: string;
  averageScore: number;
  submissionsCount: number;
}

export interface AnalyticsData {
  totalAssignments: number;
  totalSubmissions: number;
  submissionRate: number;
  averageSubmissionTimeHours: number;
  subjectDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
  recentSubmissions: AnalyticsRecentSubmission[];
  topPerformers: AnalyticsTopPerformer[];
}

export type AssignmentWithSubmission = Assignment & { submission: Submission | null };

// AssignmentWithSubmission will be imported and extended from Assignment and Submission in the DTOs 