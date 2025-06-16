export enum AssignmentErrorType {
  InvalidAssignmentId = 'Invalid assignment ID',
  InvalidSubmissionId = 'Invalid submission ID',
  AssignmentNotFound = 'Assignment not found',
  SubmissionNotFound = 'Submission not found',
  InvalidMarks = 'Invalid marks (must be between 0 and 100)',
  FileRequired = 'File is required',
  InvalidPageOrLimit = 'Invalid page or limit value',
  Unauthorized = 'Unauthorized access',
  ServerError = 'Internal server error',
  InvalidStatus = 'Invalid status value',
  InvalidDate = 'Invalid date format'
} 