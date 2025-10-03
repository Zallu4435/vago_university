import {
  CreateAssignmentRequestDTO,
  UpdateAssignmentRequestDTO,
  GetAssignmentsRequestDTO,
  GetAssignmentByIdRequestDTO,
  DeleteAssignmentRequestDTO,
  GetSubmissionsRequestDTO,
  GetSubmissionByIdRequestDTO,
  ReviewSubmissionRequestDTO,
} from '../../../domain/assignments/dtos/AssignmentRequestDTOs';
import {
  GetAssignmentsResponseDTO,
  GetAssignmentResponseDTO,
  CreateAssignmentResponseDTO,
  UpdateAssignmentResponseDTO,
  GetSubmissionsResponseDTO,
  GetSubmissionResponseDTO,
  ReviewSubmissionResponseDTO,
  AnalyticsResponseDTO,
  ResponseDTO
} from '../../../domain/assignments/dtos/AssignmentResponseDTOs';

export interface IGetAssignmentsUseCase {
  execute(params: GetAssignmentsRequestDTO): Promise<ResponseDTO<GetAssignmentsResponseDTO>>;
}

export interface IGetAssignmentByIdUseCase {
  execute(params: GetAssignmentByIdRequestDTO): Promise<ResponseDTO<GetAssignmentResponseDTO>>;
}

export interface ICreateAssignmentUseCase {
  execute(params: CreateAssignmentRequestDTO): Promise<ResponseDTO<CreateAssignmentResponseDTO>>;
}

export interface IUpdateAssignmentUseCase {
  execute(params: UpdateAssignmentRequestDTO): Promise<ResponseDTO<UpdateAssignmentResponseDTO>>;
}

export interface IDeleteAssignmentUseCase {
  execute(params: DeleteAssignmentRequestDTO): Promise<ResponseDTO<{ message: string }>>;
}

export interface IGetSubmissionsUseCase {
  execute(params: GetSubmissionsRequestDTO): Promise<ResponseDTO<GetSubmissionsResponseDTO>>;
}

export interface IGetSubmissionByIdUseCase {
  execute(params: GetSubmissionByIdRequestDTO): Promise<ResponseDTO<GetSubmissionResponseDTO>>;
}

export interface IReviewSubmissionUseCase {
  execute(params: ReviewSubmissionRequestDTO): Promise<ResponseDTO<ReviewSubmissionResponseDTO>>;
}

export interface IGetAnalyticsUseCase {
  execute(): Promise<ResponseDTO<AnalyticsResponseDTO>>;
}
