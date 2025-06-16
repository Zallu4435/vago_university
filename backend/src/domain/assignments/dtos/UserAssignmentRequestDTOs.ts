export interface GetUserAssignmentsRequestDTO {
  subject?: string;
  status?: 'pending' | 'submitted' | 'reviewed';
  page?: number;
  limit?: number;
  studentId?: string;
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
