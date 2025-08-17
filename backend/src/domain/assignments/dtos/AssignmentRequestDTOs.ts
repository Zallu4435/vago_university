import { AssignmentFile, AssignmentStatus } from '../assignmenttypes';

export type CreateAssignmentRequestDTO = Pick<AssignmentBase, 'title' | 'subject' | 'dueDate' | 'maxMarks' | 'description'> & {
  files: AssignmentFile[];
};

export type UpdateAssignmentRequestDTO = {
  id: string;
} & Partial<Omit<CreateAssignmentRequestDTO, 'files'>> & {
  files?: AssignmentFile[];
  status?: AssignmentStatus;
};

export interface GetAssignmentsRequestDTO {
  subject?: string;
  status?: AssignmentStatus;
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetAssignmentByIdRequestDTO {
  id: string;
}

export interface DeleteAssignmentRequestDTO {
  id: string;
}

export interface GetSubmissionsRequestDTO {
  assignmentId: string;
  page?: number;
  limit?: number;
}

export interface GetSubmissionByIdRequestDTO {
  assignmentId: string;
  submissionId: string;
}

export interface ReviewSubmissionRequestDTO {
  assignmentId: string;
  submissionId: string;
  marks: number;
  feedback: string;
  status: AssignmentStatus;
  isLate: boolean;
}

export interface DownloadSubmissionRequestDTO {
  assignmentId: string;
  submissionId: string;
}

export interface DownloadFileRequestDTO {
  fileUrl: string;
  fileName: string;
}

export interface DownloadSubmissionFileRequestDTO {
  fileUrl: string;
  fileName: string;
}

export interface GetAnalyticsRequestDTO {
  assignmentId?: string;
}

// Helper base type for assignment creation
interface AssignmentBase {
  title: string;
  subject: string;
  dueDate: string;
  maxMarks: number | string;
  description: string;
} 