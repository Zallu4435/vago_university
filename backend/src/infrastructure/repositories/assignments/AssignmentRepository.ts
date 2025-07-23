import { IAssignmentRepository } from '../../../application/assignments/repositories/IAssignmentRepository';
import { Assignment } from '../../../domain/assignments/entities/Assignment';
import { Submission } from '../../../domain/assignments/entities/Submission';
import { AssignmentModel, IAssignmentDocument } from '../../database/mongoose/assignment/AssignmentModel';
import { SubmissionModel, ISubmissionDocument } from '../../database/mongoose/assignment/SubmissionModel';
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

export class AssignmentRepository implements IAssignmentRepository {
  async findAssignmentsRaw(query: any, skip: number, limit: number) {
    return AssignmentModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async getAssignments(params: GetAssignmentsRequestDTO): Promise<any> {
    const { subject, status, page = 1, limit = 10 } = params;
    const query: any = {};
    if (subject) query.subject = subject;
    if (status) query.status = status;
    const skip = (page - 1) * limit;
    const [assignments, total] = await Promise.all([
      this.findAssignmentsRaw(query, skip, limit),
      AssignmentModel.countDocuments(query)
    ]);
    return { assignments, total, page, limit };
  }

  async getAssignmentById(params: GetAssignmentByIdRequestDTO): Promise<any> {
    const { id } = params;
    return AssignmentModel.findById(id);
  }

  async createAssignment(params: CreateAssignmentRequestDTO): Promise<any> {
    return AssignmentModel.create(params);
  }

  async updateAssignment(id: string, params: UpdateAssignmentRequestDTO): Promise<any> {
    return AssignmentModel.findByIdAndUpdate(
      id,
      { $set: params },
      { new: true }
    );
  }

  async deleteAssignment(params: DeleteAssignmentRequestDTO): Promise<any> {
    const { id } = params;
    return AssignmentModel.findByIdAndDelete(id);
  }

  async getSubmissions(params: GetSubmissionsRequestDTO): Promise<any> {
    const { assignmentId, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;
    const [submissions, total] = await Promise.all([
      SubmissionModel.find({ assignmentId })
        .skip(skip)
        .limit(limit)
        .sort({ submittedDate: -1 }),
      SubmissionModel.countDocuments({ assignmentId })
    ]);
    return { submissions, total, page, limit };
  }

  async getSubmissionById(params: GetSubmissionByIdRequestDTO): Promise<any> {
    const { assignmentId, submissionId } = params;
    return SubmissionModel.findOne({
      _id: submissionId,
      assignmentId
    });
  }

  async reviewSubmission(params: ReviewSubmissionRequestDTO): Promise<any> {
    const { assignmentId, submissionId, marks, feedback, status, isLate } = params;
    return SubmissionModel.findOneAndUpdate(
      { _id: submissionId, assignmentId },
      { $set: { marks, feedback, status, isLate } },
      { new: true }
    );
  }

  async downloadSubmission(params: DownloadSubmissionRequestDTO): Promise<any> {
    const { assignmentId, submissionId } = params;
    return SubmissionModel.findOne({
      _id: submissionId,
      assignmentId
    });
  }

  async getAnalytics(): Promise<any> {
    return {};
  }
} 