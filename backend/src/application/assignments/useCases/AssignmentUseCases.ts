import { IAssignmentRepository } from '../../../application/assignments/repositories/IAssignmentRepository';
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
  GetAnalyticsRequestDTO
} from '../../../domain/assignments/dtos/AssignmentRequestDTOs';
import {
  GetAssignmentsResponseDTO,
  GetAssignmentResponseDTO,
  CreateAssignmentResponseDTO,
  UpdateAssignmentResponseDTO,
  GetSubmissionsResponseDTO,
  GetSubmissionResponseDTO,
  ReviewSubmissionResponseDTO,
  AnalyticsResponseDTO
} from '../../../domain/assignments/dtos/AssignmentResponseDTOs';
import { AssignmentErrorType } from "../../../domain/assignments/enums/AssignmentErrorType";
import mongoose from "mongoose";
import { Assignment } from "../../../domain/assignments/entities/Assignment";

interface ResponseDTO<T> {
  data: T | { error: string };
  success: boolean;
}

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

export interface IDownloadSubmissionUseCase {
  execute(params: DownloadSubmissionRequestDTO): Promise<ResponseDTO<Buffer>>;
}

export interface IGetAnalyticsUseCase {
  execute(): Promise<ResponseDTO<AnalyticsResponseDTO>>;
}

export class GetAssignmentsUseCase implements IGetAssignmentsUseCase {
  constructor(private assignmentRepository: IAssignmentRepository) { }

  async execute(params: GetAssignmentsRequestDTO): Promise<ResponseDTO<GetAssignmentsResponseDTO>> {
    try {
      if (params.page && (isNaN(params.page) || params.page < 1)) {
        return { data: { error: AssignmentErrorType.InvalidPageOrLimit }, success: false };
      }
      if (params.limit && (isNaN(params.limit) || params.limit < 1)) {
        return { data: { error: AssignmentErrorType.InvalidPageOrLimit }, success: false };
      }
      const result = await this.assignmentRepository.getAssignments(params);
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetAssignmentByIdUseCase implements IGetAssignmentByIdUseCase {
  constructor(private assignmentRepository: IAssignmentRepository) { }

  async execute(params: GetAssignmentByIdRequestDTO): Promise<ResponseDTO<GetAssignmentResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.id)) {
        return { data: { error: AssignmentErrorType.InvalidAssignmentId }, success: false };
      }
      const result = await this.assignmentRepository.getAssignmentById(params);
      if (!result) {
        return { data: { error: AssignmentErrorType.AssignmentNotFound }, success: false };
      }
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class CreateAssignmentUseCase implements ICreateAssignmentUseCase {
  constructor(private assignmentRepository: IAssignmentRepository) { }

  async execute(params: CreateAssignmentRequestDTO): Promise<ResponseDTO<CreateAssignmentResponseDTO>> {
    try {

      const dueDate = new Date(params.dueDate);
      if (isNaN(dueDate.getTime())) {
        return { data: { error: AssignmentErrorType.InvalidDate }, success: false };
      }

      const maxMarks = typeof params.maxMarks === 'string' ? parseInt(params.maxMarks) : params.maxMarks;
      if (isNaN(maxMarks) || maxMarks <= 0) {
        return { data: { error: AssignmentErrorType.InvalidMarks }, success: false };
      }

      // Process files if they exist
      const files = Array.isArray(params.files) ? params.files.map(file => ({
        fileName: file.originalname,
        fileUrl: file.path,
        fileSize: file.size
      })) : [];

      const assignmentData = {
        _id: new mongoose.Types.ObjectId().toString(),
        title: params.title,
        subject: params.subject,
        dueDate: dueDate.toISOString(),
        maxMarks,
        description: params.description,
        files,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft' as const,
        totalSubmissions: 0
      };

      const assignment = Assignment.create(assignmentData);
      const result = await this.assignmentRepository.createAssignment(assignmentData);
      return { data: result, success: true };
    } catch (error: any) {
      console.error('Error in CreateAssignmentUseCase:', error);
      return { data: { error: error.message }, success: false };
    }
  }
}

export class UpdateAssignmentUseCase implements IUpdateAssignmentUseCase {
  constructor(private assignmentRepository: IAssignmentRepository) { }

  async execute(params: UpdateAssignmentRequestDTO): Promise<ResponseDTO<UpdateAssignmentResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.id)) {
        return { data: { error: AssignmentErrorType.InvalidAssignmentId }, success: false };
      }
      if (params.status && !['draft', 'published', 'closed'].includes(params.status)) {
        return { data: { error: AssignmentErrorType.InvalidStatus }, success: false };
      }
      const result = await this.assignmentRepository.updateAssignment(params.id, params);
      if (!result) {
        return { data: { error: AssignmentErrorType.AssignmentNotFound }, success: false };
      }
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class DeleteAssignmentUseCase implements IDeleteAssignmentUseCase {
  constructor(private assignmentRepository: IAssignmentRepository) { }

  async execute(params: DeleteAssignmentRequestDTO): Promise<ResponseDTO<{ message: string }>> {
    try {
      if (!mongoose.isValidObjectId(params.id)) {
        return { data: { error: AssignmentErrorType.InvalidAssignmentId }, success: false };
      }
      await this.assignmentRepository.deleteAssignment(params);
      return { data: { message: "Assignment deleted successfully" }, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetSubmissionsUseCase implements IGetSubmissionsUseCase {
  constructor(private assignmentRepository: IAssignmentRepository) { }

  async execute(params: GetSubmissionsRequestDTO): Promise<ResponseDTO<GetSubmissionsResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.assignmentId)) {
        return { data: { error: AssignmentErrorType.InvalidAssignmentId }, success: false };
      }
      if (params.page && (isNaN(params.page) || params.page < 1)) {
        return { data: { error: AssignmentErrorType.InvalidPageOrLimit }, success: false };
      }
      if (params.limit && (isNaN(params.limit) || params.limit < 1)) {
        return { data: { error: AssignmentErrorType.InvalidPageOrLimit }, success: false };
      }
      const result = await this.assignmentRepository.getSubmissions(params);
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetSubmissionByIdUseCase implements IGetSubmissionByIdUseCase {
  constructor(private assignmentRepository: IAssignmentRepository) { }

  async execute(params: GetSubmissionByIdRequestDTO): Promise<ResponseDTO<GetSubmissionResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.assignmentId)) {
        return { data: { error: AssignmentErrorType.InvalidAssignmentId }, success: false };
      }
      if (!mongoose.isValidObjectId(params.submissionId)) {
        return { data: { error: AssignmentErrorType.InvalidSubmissionId }, success: false };
      }
      const result = await this.assignmentRepository.getSubmissionById(params);
      if (!result) {
        return { data: { error: AssignmentErrorType.SubmissionNotFound }, success: false };
      }
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class ReviewSubmissionUseCase implements IReviewSubmissionUseCase {
  constructor(private assignmentRepository: IAssignmentRepository) { }

  async execute(params: ReviewSubmissionRequestDTO): Promise<ResponseDTO<ReviewSubmissionResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.assignmentId)) {
        return { data: { error: AssignmentErrorType.InvalidAssignmentId }, success: false };
      }
      if (!mongoose.isValidObjectId(params.submissionId)) {
        return { data: { error: AssignmentErrorType.InvalidSubmissionId }, success: false };
      }
      if (params.marks && (isNaN(params.marks) || params.marks < 0)) {
        return { data: { error: AssignmentErrorType.InvalidMarks }, success: false };
      }
      if (params.status && !['reviewed', 'pending', 'needs_correction'].includes(params.status)) {
        return { data: { error: AssignmentErrorType.InvalidStatus }, success: false };
      }
      const result = await this.assignmentRepository.reviewSubmission(params);
      if (!result) {
        return { data: { error: AssignmentErrorType.SubmissionNotFound }, success: false };
      }
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class DownloadSubmissionUseCase implements IDownloadSubmissionUseCase {
  constructor(private assignmentRepository: IAssignmentRepository) { }

  async execute(params: DownloadSubmissionRequestDTO): Promise<ResponseDTO<Buffer>> {
    try {
      if (!mongoose.isValidObjectId(params.assignmentId)) {
        return { data: { error: AssignmentErrorType.InvalidAssignmentId }, success: false };
      }
      if (!mongoose.isValidObjectId(params.submissionId)) {
        return { data: { error: AssignmentErrorType.InvalidSubmissionId }, success: false };
      }
      const result = await this.assignmentRepository.downloadSubmission(params);
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetAnalyticsUseCase implements IGetAnalyticsUseCase {
  constructor(private readonly assignmentRepository: IAssignmentRepository) { }

  async execute(): Promise<ResponseDTO<AnalyticsResponseDTO>> {
    try {
      const analytics = await this.assignmentRepository.getAnalytics();

      return {
        success: true,
        data: analytics
      };
    } catch (error) {
      console.error('Error in GetAnalyticsUseCase:', error);
      return {
        success: false,
        data: { error: error.message }
      };
    }
  }
} 