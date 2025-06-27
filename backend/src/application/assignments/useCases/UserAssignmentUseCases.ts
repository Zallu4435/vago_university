import { IUserAssignmentRepository } from '../../../application/assignments/repositories/IUserAssignmentRepository';
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
import { AssignmentErrorType } from '../../../domain/assignments/enums/AssignmentErrorType';
import mongoose from 'mongoose';
import { Assignment } from '../../../domain/assignments/entities/Assignment';
import { Submission } from '../../../domain/assignments/entities/Submission';

interface ResponseDTO<T> {
  data: T | { error: string };
  success: boolean;
}

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

export class GetUserAssignmentsUseCase implements IGetUserAssignmentsUseCase {
  constructor(private userAssignmentRepository: IUserAssignmentRepository) {}

  async execute(params: GetUserAssignmentsRequestDTO): Promise<ResponseDTO<GetUserAssignmentsResponseDTO>> {
    try {
      if (params.page && (isNaN(params.page) || params.page < 1)) {
        return { data: { error: AssignmentErrorType.InvalidPageOrLimit }, success: false };
      }
      if (params.limit && (isNaN(params.limit) || params.limit < 1)) {
        return { data: { error: AssignmentErrorType.InvalidPageOrLimit }, success: false };
      }
      const result = await this.userAssignmentRepository.getAssignments(params, params.studentId);
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetUserAssignmentByIdUseCase implements IGetUserAssignmentByIdUseCase {
  constructor(private userAssignmentRepository: IUserAssignmentRepository) {}

  async execute(params: GetUserAssignmentByIdRequestDTO): Promise<ResponseDTO<GetUserAssignmentResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.id)) {
        return { data: { error: AssignmentErrorType.InvalidAssignmentId }, success: false };
      }
      const result = await this.userAssignmentRepository.getAssignmentById(params, params.studentId);
      if (!result) {
        return { data: { error: AssignmentErrorType.AssignmentNotFound }, success: false };
      }
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class SubmitUserAssignmentUseCase implements ISubmitUserAssignmentUseCase {
  constructor(private userAssignmentRepository: IUserAssignmentRepository) {}

  async execute(params: SubmitUserAssignmentRequestDTO): Promise<ResponseDTO<SubmitUserAssignmentResponseDTO>> {
    console.log('=== USECASE: SUBMIT ASSIGNMENT STARTED ===');
    console.log('UseCase: Input params:', {
      assignmentId: params.assignmentId,
      file: params.file ? {
        originalname: params.file.originalname,
        size: params.file.size,
        mimetype: params.file.mimetype
      } : 'No file',
      studentId: params.studentId
    });

    try {
      if (!mongoose.isValidObjectId(params.assignmentId)) {
        console.error('UseCase: Invalid assignment ID:', params.assignmentId);
        return { data: { error: AssignmentErrorType.InvalidAssignmentId }, success: false };
      }
      
      if (!params.file) {
        console.error('UseCase: No file provided');
        return { data: { error: AssignmentErrorType.FileRequired }, success: false };
      }

      console.log('UseCase: Validation passed, calling repository...');
      const result = await this.userAssignmentRepository.submitAssignment(params, params.studentId);
      console.log('UseCase: Repository call successful, result:', result);

      console.log('=== USECASE: SUBMIT ASSIGNMENT COMPLETED ===');
      return { data: result, success: true };
    } catch (error: any) {
      console.error('UseCase: Error in submitAssignment:', error);
      console.error('UseCase: Error stack:', error.stack);
      console.log('=== USECASE: SUBMIT ASSIGNMENT FAILED ===');
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetUserAssignmentStatusUseCase implements IGetUserAssignmentStatusUseCase {
  constructor(private userAssignmentRepository: IUserAssignmentRepository) {}

  async execute(params: GetUserAssignmentStatusRequestDTO): Promise<ResponseDTO<GetUserAssignmentStatusResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.assignmentId)) {
        return { data: { error: AssignmentErrorType.InvalidAssignmentId }, success: false };
      }
      const result = await this.userAssignmentRepository.getAssignmentStatus(params, params.studentId);
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetUserAssignmentFeedbackUseCase implements IGetUserAssignmentFeedbackUseCase {
  constructor(private userAssignmentRepository: IUserAssignmentRepository) {}

  async execute(params: GetUserAssignmentFeedbackRequestDTO): Promise<ResponseDTO<GetUserAssignmentFeedbackResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.assignmentId)) {
        return { data: { error: AssignmentErrorType.InvalidAssignmentId }, success: false };
      }
      const result = await this.userAssignmentRepository.getAssignmentFeedback(params, params.studentId);
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
} 