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
  async getAssignments(params: GetAssignmentsRequestDTO): Promise<GetAssignmentsResponseDTO> {
    const { subject, status, page = 1, limit = 10 } = params;
    const query: any = {};

    if (subject) query.subject = subject;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [assignments, total] = await Promise.all([
      AssignmentModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      AssignmentModel.countDocuments(query)
    ]);

    // For each assignment, fetch submissions and calculate count and average mark
    const assignmentsWithStats = await Promise.all(assignments.map(async (assignment) => {
      const submissions = await SubmissionModel.find({ assignmentId: assignment._id });
      const submissionCount = submissions.length;
      const averageMark = submissionCount > 0 ? (submissions.reduce((sum, s) => sum + (s.marks ?? 0), 0) / submissionCount) : 0;
      const assignmentObj = this.mapToAssignment(assignment);
      return {
        ...assignmentObj,
        submissionCount,
        averageMark: Number(averageMark.toFixed(2))
      };
    }));

    return {
      assignments: assignmentsWithStats,
      total,
      page,
      limit
    };
  }

  async getAssignmentById(params: GetAssignmentByIdRequestDTO): Promise<GetAssignmentResponseDTO> {
    const { id } = params;
    const assignment = await AssignmentModel.findById(id);
    if (!assignment) {
      throw new Error('Assignment not found');
    }
    return {
      assignment: this.mapToAssignment(assignment)
    };
  }

  async createAssignment(params: CreateAssignmentRequestDTO): Promise<CreateAssignmentResponseDTO> {
    const newAssignment = await AssignmentModel.create(params);
    return {
      assignment: this.mapToAssignment(newAssignment)
    };
  }

  async updateAssignment(id: string, params: UpdateAssignmentRequestDTO): Promise<UpdateAssignmentResponseDTO> {
    const updatedAssignment = await AssignmentModel.findByIdAndUpdate(
      id,
      { $set: params },
      { new: true }
    );
    if (!updatedAssignment) {
      throw new Error('Assignment not found');
    }
    return {
      assignment: this.mapToAssignment(updatedAssignment)
    };
  }

  async deleteAssignment(params: DeleteAssignmentRequestDTO): Promise<void> {
    const { id } = params;
    const result = await AssignmentModel.findByIdAndDelete(id);
    if (!result) {
      throw new Error('Assignment not found');
    }
  }

  async getSubmissions(params: GetSubmissionsRequestDTO): Promise<GetSubmissionsResponseDTO> {
    const { assignmentId, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      SubmissionModel.find({ assignmentId })
        .skip(skip)
        .limit(limit)
        .sort({ submittedDate: -1 }),
      SubmissionModel.countDocuments({ assignmentId })
    ]);

    return {
      submissions: submissions.map(this.mapToSubmission),
      total,
      page,
      limit
    };
  }

  async getSubmissionById(params: GetSubmissionByIdRequestDTO): Promise<GetSubmissionResponseDTO> {
    const { assignmentId, submissionId } = params;
    const submission = await SubmissionModel.findOne({
      _id: submissionId,
      assignmentId
    });
    if (!submission) {
      throw new Error('Submission not found');
    }
    return {
      submission: this.mapToSubmission(submission)
    };
  }

  async reviewSubmission(params: ReviewSubmissionRequestDTO): Promise<ReviewSubmissionResponseDTO> {
    const { assignmentId, submissionId, marks, feedback, status, isLate } = params;
    const submission = await SubmissionModel.findOneAndUpdate(
      { _id: submissionId, assignmentId },
      { $set: { marks, feedback, status, isLate } },
      { new: true }
    );
    if (!submission) {
      throw new Error('Submission not found');
    }
    return {
      submission: this.mapToSubmission(submission)
    };
  }

  async downloadSubmission(params: DownloadSubmissionRequestDTO): Promise<Buffer> {
    const { assignmentId, submissionId } = params;
    const submission = await SubmissionModel.findOne({
      _id: submissionId,
      assignmentId
    });
    if (!submission) {
      throw new Error('Submission not found');
    }
    return Buffer.from('');
  }

  async getAnalytics(): Promise<AnalyticsResponseDTO> {
    try {
      const [
        totalAssignments,
        totalSubmissions,
        submissionRate,
        averageSubmissionTime,
        subjectDistribution,
        statusDistribution,
        recentSubmissions,
        topPerformers
      ] = await Promise.all([
        AssignmentModel.countDocuments(),
        AssignmentModel.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: '$totalSubmissions' }
            }
          }
        ]),
        AssignmentModel.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              withSubmissions: {
                $sum: {
                  $cond: [
                    { $gt: ['$totalSubmissions', 0] },
                    1,
                    0
                  ]
                }
              }
            }
          }
        ]),
        AssignmentModel.aggregate([
          {
            $match: {
              totalSubmissions: { $gt: 0 }
            }
          },
          {
            $group: {
              _id: null,
              avgTime: {
                $avg: {
                  $subtract: ['$updatedAt', '$createdAt']
                }
              }
            }
          }
        ]),
        AssignmentModel.aggregate([
          {
            $group: {
              _id: '$subject',
              count: { $sum: 1 },
              submissions: { $sum: '$totalSubmissions' }
            }
          }
        ]),
        AssignmentModel.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              submissions: { $sum: '$totalSubmissions' }
            }
          }
        ]),
        AssignmentModel.aggregate([
          {
            $match: {
              totalSubmissions: { $gt: 0 }
            }
          },
          {
            $sort: { updatedAt: -1 }
          },
          {
            $limit: 5
          },
          {
            $project: {
              assignmentTitle: '$title',
              studentName: { $literal: 'N/A' },
              submittedAt: '$updatedAt',
              score: '$averageMarks'
            }
          }
        ]),
        AssignmentModel.aggregate([
          {
            $match: {
              totalSubmissions: { $gt: 0 }
            }
          },
          {
            $sort: { averageMarks: -1 }
          },
          {
            $limit: 5
          },
          {
            $project: {
              studentId: { $literal: 'N/A' },
              studentName: { $literal: 'N/A' },
              averageScore: '$averageMarks',
              submissionsCount: '$totalSubmissions'
            }
          }
        ])
      ]);

      const analytics = {
        totalAssignments,
        totalSubmissions: totalSubmissions[0]?.total || 0,
        submissionRate: submissionRate[0] ? (submissionRate[0].withSubmissions / submissionRate[0].total) * 100 : 0,
        averageSubmissionTimeHours: averageSubmissionTime[0]?.avgTime ? averageSubmissionTime[0].avgTime / (1000 * 60 * 60) : 0,
        subjectDistribution: subjectDistribution.reduce((acc, curr) => ({
          ...acc,
          [curr._id]: {
            count: curr.count,
            submissions: curr.submissions
          }
        }), {}),
        statusDistribution: statusDistribution.reduce((acc, curr) => ({
          ...acc,
          [curr._id]: {
            count: curr.count,
            submissions: curr.submissions
          }
        }), {}),
        recentSubmissions,
        topPerformers
      };

      return analytics;
    } catch (error) {
      console.error('Error in getAnalytics:', error);
      throw error;
    }
  }

  private mapToAssignment(doc: IAssignmentDocument): Assignment {
    return {
      _id: doc._id.toString(),
      title: doc.title,
      subject: doc.subject,
      dueDate: doc.dueDate,
      maxMarks: doc.maxMarks,
      description: doc.description,
      files: doc.files,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      status: doc.status,
      totalSubmissions: doc.totalSubmissions,
      averageMarks: doc.averageMarks
    };
  }

  private mapToSubmission(doc: ISubmissionDocument): Submission {
    return {
      _id: doc._id.toString(),
      assignmentId: doc.assignmentId.toString(),
      studentId: doc.studentId,
      studentName: doc.studentName,
      submittedDate: doc.submittedDate,
      status: doc.status,
      marks: doc.marks,
      feedback: doc.feedback,
      isLate: doc.isLate,
      files: doc.files.map(f => f.fileUrl)
    };
  }
} 