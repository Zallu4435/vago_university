interface AssignmentFile {
  originalname: string;
  path: string;
  size: number;
}

export interface CreateAssignmentRequestDTO {
  title: string;
  subject: string;
  dueDate: string;
  maxMarks: number | string;
  description: string;
  files: AssignmentFile[];
}

export interface UpdateAssignmentRequestDTO {
  title?: string;
  subject?: string;
  dueDate?: string;
  maxMarks?: number;
  description?: string;
  files?: string[];
  status?: 'draft' | 'published' | 'closed';
}

export interface GetAssignmentsRequestDTO {
  subject?: string;
  status?: 'draft' | 'published' | 'closed';
  page?: number;
  limit?: number;
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
  status: 'reviewed' | 'pending' | 'needs_correction';
}

export interface DownloadSubmissionRequestDTO {
  assignmentId: string;
  submissionId: string;
}

export interface GetAnalyticsRequestDTO {
  assignmentId?: string;
} 