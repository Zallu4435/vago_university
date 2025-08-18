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
      if (params.page && (isNaN(params.page) || params.page < 1)) {
        return { data: { error: AssignmentErrorType.InvalidPageOrLimit }, success: false };
      }
      if (params.limit && (isNaN(params.limit) || params.limit < 1)) {
        return { data: { error: AssignmentErrorType.InvalidPageOrLimit }, success: false };
      }
    const { assignments, page, limit, status, studentId } = await this.userAssignmentRepository.getAssignments(params.subject, params.status, params.page, params.limit, params.search, params.studentId, params.sortBy);
    const assignmentIds = assignments.map((assignment) => assignment._id);
    const submissions = await (require('../../../infrastructure/database/mongoose/assignment/SubmissionModel').SubmissionModel).find({
      assignmentId: { $in: assignmentIds },
      studentId: studentId
    }).lean();
    const submissionMap = new Map();
    submissions.forEach((submission) => {
      submissionMap.set(submission.assignmentId.toString(), submission);
    });
    let filteredAssignments = assignments;
    if (status && status !== 'all') {
      if (status === 'graded') {
        filteredAssignments = assignments.filter((assignment) => {
          const submission = submissionMap.get(assignment._id.toString());
          return submission && submission.status === 'reviewed';
        });
      } else if (status === 'submitted') {
        filteredAssignments = assignments.filter((assignment) => {
          const submission = submissionMap.get(assignment._id.toString());
          return !!submission;
        });
      } else {
        filteredAssignments = assignments.filter((assignment) => assignment.status === status);
      }
    }
    const total = filteredAssignments.length;
    const paginatedAssignments = filteredAssignments.slice((page - 1) * limit, page * limit);
    const result = {
      assignments: paginatedAssignments.map((assignment) => {
        const assignmentData = {
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
          totalSubmissions: assignment.totalSubmissions
        };
        const submission = submissionMap.get(assignment._id.toString());
        return {
          ...assignmentData,
          submission: submission ? {
            id: submission._id.toString(),
            studentId: submission.studentId,
            studentName: submission.studentName,
            assignmentId: submission.assignmentId.toString(),
            files: submission.files,
            submittedDate: submission.submittedDate,
            status: submission.status,
            marks: submission.marks,
            feedback: submission.feedback,
            isLate: submission.isLate
          } : null
        };
      }),
      total,
      page,
      limit
    };
    return { data: result, success: true };
  }
}

export class GetUserAssignmentByIdUseCase implements IGetUserAssignmentByIdUseCase {
  constructor(private userAssignmentRepository: IUserAssignmentRepository) {}

  async execute(params: GetUserAssignmentByIdRequestDTO): Promise<ResponseDTO<GetUserAssignmentResponseDTO>> {
      if (!params.id || params.id.trim() === '') {
        return { data: { error: AssignmentErrorType.InvalidAssignmentId }, success: false };
      }
    const { assignment, submission } = await this.userAssignmentRepository.getAssignmentById(params.id, params.studentId);
    if (!assignment) {
        return { data: { error: AssignmentErrorType.AssignmentNotFound }, success: false };
      }
    const assignmentData = {
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
      totalSubmissions: assignment.totalSubmissions
    };
    return {
      data: {
        assignment: {
          ...assignmentData,
          submission: submission ? {
            id: submission._id.toString(),
            studentId: submission.studentId,
            studentName: submission.studentName,
            assignmentId: submission.assignmentId.toString(),
            files: submission.files,
            submittedDate: submission.submittedDate,
            status: submission.status,
            marks: submission.marks,
            feedback: submission.feedback,
            isLate: submission.isLate
          } : null
        }
      },
      success: true
    };
  }
}

export class SubmitUserAssignmentUseCase implements ISubmitUserAssignmentUseCase {
  constructor(private userAssignmentRepository: IUserAssignmentRepository) {}

  async execute(params: SubmitUserAssignmentRequestDTO): Promise<ResponseDTO<SubmitUserAssignmentResponseDTO>> {
      if (!params.assignmentId || params.assignmentId.trim() === '') {
        return { data: { error: AssignmentErrorType.InvalidAssignmentId }, success: false };
      }
      if (!params.file) {
        return { data: { error: AssignmentErrorType.FileRequired }, success: false };
      }
    const { submission } = await this.userAssignmentRepository.submitAssignment(params.assignmentId, [params.file], params.studentId);
    if (!submission) {
      return { data: { error: 'Submission failed' }, success: false };
    }
    const submissionObj = {
      id: submission._id.toString(),
      studentId: submission.studentId,
      studentName: submission.studentName,
      assignmentId: submission.assignmentId.toString(),
      files: submission.files,
      submittedDate: submission.submittedDate,
      status: submission.status,
      marks: submission.marks,
      feedback: submission.feedback,
      isLate: submission.isLate
    };
    return { data: { submission: submissionObj }, success: true };
  }
}

export class GetUserAssignmentStatusUseCase implements IGetUserAssignmentStatusUseCase {
  constructor(private userAssignmentRepository: IUserAssignmentRepository) {}

  async execute(params: GetUserAssignmentStatusRequestDTO): Promise<ResponseDTO<GetUserAssignmentStatusResponseDTO>> {
      if (!params.assignmentId || params.assignmentId.trim() === '') {
        return { data: { error: AssignmentErrorType.InvalidAssignmentId }, success: false };
      }
    const { submission } = await this.userAssignmentRepository.getAssignmentStatus(params.assignmentId, params.studentId);
    if (!submission) {
      return { data: { status: 'pending' }, success: true };
    }
    return {
      data: {
        status: submission.status as 'pending' | 'reviewed' | 'late' | 'needs_correction',
        submittedAt: submission.submittedDate,
        score: submission.marks
      },
      success: true
    };
  }
}

export class GetUserAssignmentFeedbackUseCase implements IGetUserAssignmentFeedbackUseCase {
  constructor(private userAssignmentRepository: IUserAssignmentRepository) {}

  async execute(params: GetUserAssignmentFeedbackRequestDTO): Promise<ResponseDTO<GetUserAssignmentFeedbackResponseDTO>> {
      if (!params.assignmentId || params.assignmentId.trim() === '') {
        return { data: { error: AssignmentErrorType.InvalidAssignmentId }, success: false };
      }
    const { submission } = await this.userAssignmentRepository.getAssignmentFeedback(params.assignmentId, params.studentId);
    if (!submission) {
      return { data: { error: 'Feedback not found' }, success: false };
    }
    return {
      data: {
        feedback: submission.feedback || '',
        score: submission.marks || 0,
        reviewedAt: new Date()
      },
      success: true
    };
  }
} 