import {
  GetUserAssignmentsRequestDTO,
  GetUserAssignmentByIdRequestDTO,
  SubmitUserAssignmentRequestDTO,
  GetUserAssignmentStatusRequestDTO,
  GetUserAssignmentFeedbackRequestDTO
} from '../../../domain/assignments/dtos/UserAssignmentRequestDTOs';
import {
  GetUserAssignmentsResponseDTO,
  GetUserAssignmentResponseDTO,
  SubmitUserAssignmentResponseDTO,
  GetUserAssignmentStatusResponseDTO,
  GetUserAssignmentFeedbackResponseDTO
} from '../../../domain/assignments/dtos/UserAssignmentResponseDTOs';

export interface IUserAssignmentRepository {
  getAssignments(params: GetUserAssignmentsRequestDTO, studentId: string): Promise<GetUserAssignmentsResponseDTO>;
  getAssignmentById(params: GetUserAssignmentByIdRequestDTO, studentId: string): Promise<GetUserAssignmentResponseDTO>;
  submitAssignment(params: SubmitUserAssignmentRequestDTO, studentId: string): Promise<SubmitUserAssignmentResponseDTO>;
  getAssignmentStatus(params: GetUserAssignmentStatusRequestDTO, studentId: string): Promise<GetUserAssignmentStatusResponseDTO>;
  getAssignmentFeedback(params: GetUserAssignmentFeedbackRequestDTO, studentId: string): Promise<GetUserAssignmentFeedbackResponseDTO>;
} 