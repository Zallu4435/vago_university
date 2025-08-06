import {
  CreateAssignmentRequestDTO,
  UpdateAssignmentRequestDTO,
  GetAssignmentsRequestDTO,
  GetAssignmentByIdRequestDTO,
  DeleteAssignmentRequestDTO,
  GetSubmissionsRequestDTO,
  GetSubmissionByIdRequestDTO,
  ReviewSubmissionRequestDTO,
  DownloadSubmissionRequestDTO,
} from "../../../domain/assignments/dtos/AssignmentRequestDTOs";
import {
  GetAssignmentsResponseDTO,
  GetAssignmentResponseDTO,
  CreateAssignmentResponseDTO,
  UpdateAssignmentResponseDTO,
  GetSubmissionsResponseDTO,
  GetSubmissionResponseDTO,
  ReviewSubmissionResponseDTO,
  AnalyticsResponseDTO
} from "../../../domain/assignments/dtos/AssignmentResponseDTOs";

export interface IAssignmentRepository {
  getAssignments(params: GetAssignmentsRequestDTO): Promise<GetAssignmentsResponseDTO>;
  getAssignmentById(params: GetAssignmentByIdRequestDTO): Promise<GetAssignmentResponseDTO>;
  createAssignment(params: CreateAssignmentRequestDTO): Promise<CreateAssignmentResponseDTO>;
  updateAssignment(id: string, params: UpdateAssignmentRequestDTO): Promise<UpdateAssignmentResponseDTO>;
  deleteAssignment(params: DeleteAssignmentRequestDTO): Promise<void>;
  getSubmissions(params: GetSubmissionsRequestDTO): Promise<GetSubmissionsResponseDTO>;
  getSubmissionById(params: GetSubmissionByIdRequestDTO): Promise<GetSubmissionResponseDTO>;
  reviewSubmission(params: ReviewSubmissionRequestDTO): Promise<ReviewSubmissionResponseDTO>;
  downloadSubmission(params: DownloadSubmissionRequestDTO): Promise<Buffer>;
  getAnalytics(): Promise<AnalyticsResponseDTO>;
} 