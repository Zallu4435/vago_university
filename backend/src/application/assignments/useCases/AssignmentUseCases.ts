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
import { AssignmentStatus, IAssignment } from '../../../domain/assignments/entities/Assignment';
import { AssignmentErrorType } from "../../../domain/assignments/enums/AssignmentErrorType";

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

  async execute(params: GetAssignmentsRequestDTO & { search?: string }): Promise<ResponseDTO<GetAssignmentsResponseDTO>> {
    if (params.page && (isNaN(params.page) || params.page < 1)) {
      return { data: { error: AssignmentErrorType.InvalidPageOrLimit }, success: false };
    }
    if (params.limit && (isNaN(params.limit) || params.limit < 1)) {
      return { data: { error: AssignmentErrorType.InvalidPageOrLimit }, success: false };
    }
    const { assignments, total, page, limit } = await this.assignmentRepository.getAssignments(params.subject, params.status, params.page, params.limit, params.search);
    const assignmentDTOs = assignments.map(assignment => ({
      _id: assignment._id.toString(),
      title: assignment.title,
      subject: assignment.subject,
      dueDate: assignment.dueDate,
      maxMarks: assignment.maxMarks,
      description: assignment.description,
      files: assignment.files,
      createdAt: assignment.createdAt,
      updatedAt: assignment.updatedAt,
      status: assignment.status,
      totalSubmissions: assignment.totalSubmissions,
      averageMarks: assignment.averageMarks
    }));
    return { data: { assignments: assignmentDTOs, total, page, limit }, success: true };
  }
}

export class GetAssignmentByIdUseCase implements IGetAssignmentByIdUseCase {
  constructor(private assignmentRepository: IAssignmentRepository) { }

  async execute(params: GetAssignmentByIdRequestDTO): Promise<ResponseDTO<GetAssignmentResponseDTO>> {
    if (!params.id || params.id.trim() === '') {
      return { data: { error: AssignmentErrorType.InvalidAssignmentId }, success: false };
    }
    const assignment = await this.assignmentRepository.getAssignmentById(params.id);
    if (!assignment) {
      return { data: { error: AssignmentErrorType.AssignmentNotFound }, success: false };
    }
    const assignmentObj = {
      _id: assignment._id.toString(),
      title: assignment.title,
      subject: assignment.subject,
      dueDate: assignment.dueDate,
      maxMarks: assignment.maxMarks,
      description: assignment.description,
      files: assignment.files,
      createdAt: assignment.createdAt,
      updatedAt: assignment.updatedAt,
      status: assignment.status,
      totalSubmissions: assignment.totalSubmissions || 0,
      averageMarks: assignment.averageMarks || 0
    };
    return { data: { assignment: assignmentObj }, success: true };
  }
}

export class CreateAssignmentUseCase implements ICreateAssignmentUseCase {
  constructor(private assignmentRepository: IAssignmentRepository) { }

  async execute(params: CreateAssignmentRequestDTO): Promise<ResponseDTO<CreateAssignmentResponseDTO>> {
    // Transform the DTO into a complete Assignment with default values
    const assignmentData: IAssignment = {
      title: params.title,
      subject: params.subject,
      description: params.description,
      maxMarks: Number(params.maxMarks),
      dueDate: new Date(params.dueDate),
      files: params.files || [],
      status: AssignmentStatus.Draft, // Default status
      totalSubmissions: 0,            // Default value
      averageMarks: 0,               // Default value
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newAssignment = await this.assignmentRepository.createAssignment(assignmentData);
    
    const assignmentObj = {
      _id: newAssignment._id.toString(),
      title: newAssignment.title,
      subject: newAssignment.subject,
      dueDate: newAssignment.dueDate,
      maxMarks: newAssignment.maxMarks,
      description: newAssignment.description,
      files: newAssignment.files,
      createdAt: newAssignment.createdAt,
      updatedAt: newAssignment.updatedAt,
      status: newAssignment.status,
      totalSubmissions: newAssignment.totalSubmissions || 0,
      averageMarks: newAssignment.averageMarks || 0
    };
    
    return { data: { assignment: assignmentObj }, success: true };
  }
}

export class UpdateAssignmentUseCase implements IUpdateAssignmentUseCase {
  constructor(private assignmentRepository: IAssignmentRepository) { }

  async execute(params: UpdateAssignmentRequestDTO): Promise<ResponseDTO<UpdateAssignmentResponseDTO>> {
    if (!params.id || params.id.trim() === '') {
      return { data: { error: AssignmentErrorType.InvalidAssignmentId }, success: false };
    }
    if (params.status && !['draft', 'published', 'closed'].includes(params.status)) {
      return { data: { error: AssignmentErrorType.InvalidStatus }, success: false };
    }

    // Transform the incoming data to match Assignment structure
    const updateData: Partial<IAssignment> = {
      ...(params.title && { title: params.title }),
      ...(params.subject && { subject: params.subject }),
      ...(params.description && { description: params.description }),
      ...(params.maxMarks && { maxMarks: Number(params.maxMarks) }),
      ...(params.dueDate && { dueDate: new Date(params.dueDate) }),
      ...(params.files && {
        files: params.files.map(file => ({
          fileName: file.fileName,
          fileUrl: file.fileUrl,
        }))
      }),
      ...(params.status && { status: params.status as AssignmentStatus }),
      updatedAt: new Date()
    };

    const updatedAssignment = await this.assignmentRepository.updateAssignment(params.id, updateData);
    if (!updatedAssignment) {
      return { data: { error: AssignmentErrorType.AssignmentNotFound }, success: false };
    }

    const assignmentObj = {
      _id: updatedAssignment._id.toString(),
      title: updatedAssignment.title,
      subject: updatedAssignment.subject,
      dueDate: updatedAssignment.dueDate,
      maxMarks: updatedAssignment.maxMarks,
      description: updatedAssignment.description,
      files: updatedAssignment.files,
      createdAt: updatedAssignment.createdAt,
      updatedAt: updatedAssignment.updatedAt,
      status: updatedAssignment.status,
      totalSubmissions: updatedAssignment.totalSubmissions || 0,
      averageMarks: updatedAssignment.averageMarks || 0
    };

    return { data: { assignment: assignmentObj }, success: true };
  }
}

export class DeleteAssignmentUseCase implements IDeleteAssignmentUseCase {
  constructor(private assignmentRepository: IAssignmentRepository) { }

  async execute(params: DeleteAssignmentRequestDTO): Promise<ResponseDTO<{ message: string }>> {
    if (!params.id || params.id.trim() === '') {
      return { data: { error: AssignmentErrorType.InvalidAssignmentId }, success: false };
    }
    await this.assignmentRepository.deleteAssignment(params.id);
    return { data: { message: "Assignment deleted successfully" }, success: true };
  }
}

export class GetSubmissionsUseCase implements IGetSubmissionsUseCase {
  constructor(private assignmentRepository: IAssignmentRepository) { }

  async execute(params: GetSubmissionsRequestDTO): Promise<ResponseDTO<GetSubmissionsResponseDTO>> {
    const { submissions, total, page, limit } = await this.assignmentRepository.getSubmissions(params.assignmentId, params.page, params.limit);
    const mappedSubmissions = submissions.map((submission) => ({
      id: submission._id.toString(),
      assignmentId: submission.assignmentId.toString(),
      studentId: submission.studentId,
      studentName: submission.studentName,
      submittedDate: submission.submittedDate,
      status: submission.status,
      marks: submission.marks,
      feedback: submission.feedback,
      isLate: submission.isLate,
      files: submission.files
    }));
    return { data: { submissions: mappedSubmissions, total, page, limit }, success: true };
  }
}

export class GetSubmissionByIdUseCase implements IGetSubmissionByIdUseCase {
  constructor(private assignmentRepository: IAssignmentRepository) { }

  async execute(params: GetSubmissionByIdRequestDTO): Promise<ResponseDTO<GetSubmissionResponseDTO>> {
    const submission = await this.assignmentRepository.getSubmissionById(params.assignmentId, params.submissionId);
    if (!submission) {
      return { data: { error: 'Submission not found' }, success: false };
    }
    const submissionObj = {
      id: submission._id.toString(),
      assignmentId: submission.assignmentId.toString(),
      studentId: submission.studentId,
      studentName: submission.studentName,
      submittedDate: submission.submittedDate,
      status: submission.status,
      marks: submission.marks,
      feedback: submission.feedback,
      isLate: submission.isLate,
      files: submission.files
    };
    return { data: { submission: submissionObj }, success: true };
  }
}

export class ReviewSubmissionUseCase implements IReviewSubmissionUseCase {
  constructor(private assignmentRepository: IAssignmentRepository) { }

  async execute(params: ReviewSubmissionRequestDTO): Promise<ResponseDTO<ReviewSubmissionResponseDTO>> {
    const updatedSubmission = await this.assignmentRepository.reviewSubmission(params.assignmentId, params.submissionId, params.marks, params.feedback, params.status, params.isLate);
    if (!updatedSubmission) {
      return { data: { error: 'Submission not found' }, success: false };
    }
    const submissionObj = {
      id: updatedSubmission._id.toString(),
      assignmentId: updatedSubmission.assignmentId.toString(),
      studentId: updatedSubmission.studentId,
      studentName: updatedSubmission.studentName,
      submittedDate: updatedSubmission.submittedDate,
      status: updatedSubmission.status,
      marks: updatedSubmission.marks,
      feedback: updatedSubmission.feedback,
      isLate: updatedSubmission.isLate,
      files: updatedSubmission.files
    };
    return { data: { submission: submissionObj }, success: true };
  }
}

export class DownloadSubmissionUseCase implements IDownloadSubmissionUseCase {
  constructor(private assignmentRepository: IAssignmentRepository) { }

  async execute(params: DownloadSubmissionRequestDTO): Promise<ResponseDTO<Buffer>> {
    const submission = await this.assignmentRepository.downloadSubmission(params.assignmentId, params.submissionId);
    if (!submission) {
      return { data: { error: 'Submission not found' }, success: false };
    }
    return { data: Buffer.from(''), success: true };
  }
}

export class GetAnalyticsUseCase implements IGetAnalyticsUseCase {
  constructor(private readonly assignmentRepository: IAssignmentRepository) { }

  async execute(): Promise<ResponseDTO<AnalyticsResponseDTO>> {
    const analytics = await this.assignmentRepository.getAnalytics();
    return { data: analytics, success: true };
  }
}