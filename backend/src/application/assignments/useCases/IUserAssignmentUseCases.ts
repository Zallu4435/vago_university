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
  GetUserAssignmentFeedbackResponseDTO,
  ResponseDTO
} from '../../../domain/assignments/dtos/UserAssignmentResponseDTOs';

export interface IGetUserAssignmentsUseCase {
  execute(params: GetUserAssignmentsRequestDTO): Promise<ResponseDTO<GetUserAssignmentsResponseDTO>>;
}

export interface IGetUserAssignmentByIdUseCase {
  execute(params: GetUserAssignmentByIdRequestDTO): Promise<ResponseDTO<GetUserAssignmentResponseDTO>>;
}

export interface ISubmitUserAssignmentUseCase {
  execute(params: SubmitUserAssignmentRequestDTO): Promise<ResponseDTO<SubmitUserAssignmentResponseDTO>>;
}

export interface IGetUserAssignmentStatusUseCase {
  execute(params: GetUserAssignmentStatusRequestDTO): Promise<ResponseDTO<GetUserAssignmentStatusResponseDTO>>;
}

export interface IGetUserAssignmentFeedbackUseCase {
  execute(params: GetUserAssignmentFeedbackRequestDTO): Promise<ResponseDTO<GetUserAssignmentFeedbackResponseDTO>>;
}
