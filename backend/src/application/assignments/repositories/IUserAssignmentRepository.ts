import { IAssignmentDocument } from '../../../infrastructure/database/mongoose/assignment/AssignmentModel';
import { ISubmissionDocument } from '../../../infrastructure/database/mongoose/assignment/SubmissionModel';


export interface AssignmentFile {
  originalname: string;
  filename: string;
  path?: string;
  mimetype?: string;
  size?: number;
  buffer?: Buffer;
}

export interface IUserAssignmentRepository {
  getAssignments(subject: string, status: string, page: number, limit: number, search: string, studentId: string, sortBy: string): Promise<{ assignments: IAssignmentDocument[]; page: number; limit: number; status: string; studentId: string }>;
  getAssignmentById(id: string, studentId: string): Promise<{ assignment: IAssignmentDocument | null; submission: ISubmissionDocument | null }>;
  submitAssignment(assignmentId: string, files: AssignmentFile[], studentId: string): Promise<{ submission: ISubmissionDocument }>;
  getAssignmentStatus(assignmentId: string, studentId: string): Promise<{ submission: ISubmissionDocument | null }>;
  getAssignmentFeedback(assignmentId: string, studentId: string): Promise<{ submission: ISubmissionDocument | null }>;
}  