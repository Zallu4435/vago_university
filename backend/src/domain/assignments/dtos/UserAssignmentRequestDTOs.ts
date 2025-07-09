import { AssignmentStatus } from '../assignmenttypes';

export interface GetUserAssignmentsRequestDTO {
  subject?: string;
  status?: AssignmentStatus;
  page?: number;
  limit?: number;
  studentId?: string;
  search?: string;
  sortBy?: string;
}

export interface GetUserAssignmentByIdRequestDTO {
  id: string;
  studentId?: string;
}

export interface SubmitUserAssignmentRequestDTO {
  assignmentId: string;
  file: Express.Multer.File;
  studentId?: string;
}

export interface GetUserAssignmentStatusRequestDTO {
  assignmentId: string;
  studentId?: string;
}

export interface GetUserAssignmentFeedbackRequestDTO {
  assignmentId: string;
  studentId?: string;
}
