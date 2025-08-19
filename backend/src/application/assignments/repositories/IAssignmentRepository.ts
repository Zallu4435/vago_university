import { IAssignment } from "../../../domain/assignments/entities/Assignment";
import { IAssignmentDocument } from "../../../infrastructure/database/mongoose/assignment/AssignmentModel";
import { ISubmissionDocument } from "../../../infrastructure/database/mongoose/assignment/SubmissionModel";
 
export interface IAssignmentRepository {
  getAssignments(subject: string, status: string, page: number, limit: number, search: string): Promise<{ assignments: IAssignmentDocument[]; total: number; page: number; limit: number }>;
  getAssignmentById(id: string): Promise<IAssignmentDocument | null>;
  createAssignment(assignment: IAssignment): Promise<IAssignmentDocument>;
  updateAssignment(id: string, assignment: Partial<IAssignment>): Promise<IAssignment | null>;
  deleteAssignment(id: string): Promise<IAssignmentDocument>;
  getSubmissions(assignmentId: string, page: number, limit: number, search?: string, status?: string, isLate?: boolean, sortBy?: string, sortOrder?: string): Promise<{ submissions: ISubmissionDocument[]; total: number; page: number; limit: number }>;
  getSubmissionById(assignmentId: string, submissionId: string): Promise<ISubmissionDocument | null>;
  reviewSubmission(assignmentId: string, submissionId: string, marks: number, feedback: string, status: string, isLate: boolean): Promise<ISubmissionDocument | null>;
  getSubmissionsStats(assignmentIds: string[]): Promise<Array<{
    _id: string;
    totalSubmissions: number;
    totalMarks: number;
    gradedSubmissions: number;
  }>>;
  getAnalytics(): Promise<{
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
  }>;
} 