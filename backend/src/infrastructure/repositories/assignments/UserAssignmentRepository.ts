import { IUserAssignmentRepository } from '../../../application/assignments/repositories/IUserAssignmentRepository';
import { Assignment } from '../../../domain/assignments/entities/Assignment';
import { Submission } from '../../../domain/assignments/entities/Submission';
import { AssignmentModel } from '../../database/mongoose/assignment/AssignmentModel';
import { SubmissionModel } from '../../database/mongoose/assignment/SubmissionModel';
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
  AssignmentWithSubmission
} from '../../../domain/assignments/dtos/UserAssignmentResponseDTOs';
import mongoose from 'mongoose';

export class UserAssignmentRepository implements IUserAssignmentRepository {
  async getAssignments(params: GetUserAssignmentsRequestDTO, studentId: string): Promise<GetUserAssignmentsResponseDTO> {
    const startTime = Date.now();

    try {
      const { subject, status, page = 1, limit = 10, search, sortBy } = params;
      const query: any = {};

      if (subject && subject !== 'all') {
        query.subject = subject;
      }

      if (search && search.trim() !== '') {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } }
        ];
      }

      // Sorting
      let sortField: string;
      let sortOrder: 1 | -1 = 1;
      switch (sortBy) {
        case 'dueDate':
        default:
          sortField = 'dueDate';
          break;
        case 'priority':
          sortField = 'priority';
          break;
        case 'status':
          sortField = 'status';
          break;
        case 'course':
        case 'subject':
          sortField = 'subject';
          break;
      }

      let filterByGraded = false;
      let filterBySubmitted = false;
      if (status && status !== 'all') {
        if (status === 'graded') {
          filterByGraded = true;
        } else if (status === 'submitted') {
          filterBySubmitted = true;
        } else {
          query.status = status;
        }
      }

      let assignments = await AssignmentModel.find(query)
        .sort({ [sortField]: sortOrder });

      const assignmentIds = assignments.map(assignment => assignment._id);
      const submissions = await SubmissionModel.find({
        assignmentId: { $in: assignmentIds },
        studentId: studentId
      }).lean();

      const submissionMap = new Map();
      submissions.forEach(submission => {
        submissionMap.set(submission.assignmentId.toString(), submission);
      });

      if (filterByGraded) {
        assignments = assignments.filter(assignment => {
          const submission = submissionMap.get(assignment._id.toString());
          return submission && submission.status === 'reviewed';
        });
      }

      if (filterBySubmitted) {
        assignments = assignments.filter(assignment => {
          const submission = submissionMap.get(assignment._id.toString());
          return !!submission;
        });
      }

      const total = assignments.length;
      assignments = assignments.slice((page - 1) * limit, page * limit);

      const result = {
        assignments: assignments.map(assignment => {
          const assignmentData = this.mapToAssignment(assignment);
          const submission = submissionMap.get(assignment._id.toString());

          return {
            ...assignmentData,
            submission: submission ? this.mapToSubmission(submission) : null
          };
        }),
        total,
        page,
        limit
      };
      return result;
    } catch (error) {
      console.error('Repository: Error in getAssignments:', error);
      throw error;
    }
  }

  async getAssignmentById(params: GetUserAssignmentByIdRequestDTO, studentId: string): Promise<GetUserAssignmentResponseDTO> {
    const { id } = params;
    const assignment = await AssignmentModel.findOne({ _id: id, status: 'published' });
    if (!assignment) throw new Error('Assignment not found');

    const submission = await SubmissionModel.findOne({
      assignmentId: id,
      studentId: studentId
    }).lean();

    const assignmentData = this.mapToAssignment(assignment);
    const assignmentWithSubmission: AssignmentWithSubmission = {
      ...assignmentData,
      submission: submission ? this.mapToSubmission(submission) : null
    };

    return { assignment: assignmentWithSubmission };
  }

  async submitAssignment(params: SubmitUserAssignmentRequestDTO, studentId: string): Promise<SubmitUserAssignmentResponseDTO> {

    try {
      const { assignmentId, file } = params;

      const student = await mongoose.model('User').findOne({ _id: studentId });
      if (!student) {
        console.error('Repository: Student not found with ID:', studentId);
        throw new Error('Student not found');
      }

      const existingSubmission = await SubmissionModel.findOne({
        assignmentId,
        studentId
      });

      let submission;

      if (existingSubmission) {
        const newStatus = existingSubmission.status === 'needs_correction' ? 'pending' : existingSubmission.status;

        submission = await SubmissionModel.findOneAndUpdate(
          { assignmentId, studentId },
          {
            files: [{
              fileName: file.originalname,
              fileUrl: file.path,
              fileSize: file.size
            }],
            submittedDate: new Date(),
            status: newStatus,
            isLate: false,
            marks: undefined,
            feedback: undefined,
            reviewedAt: undefined
          },
          { new: true, upsert: false }
        );

      } else {
        submission = await SubmissionModel.create({
          studentId,
          studentName: `${student.firstName} ${student.lastName}`,
          assignmentId,
          files: [{
            fileName: file.originalname,
            fileUrl: file.path,
            fileSize: file.size
          }],
          submittedDate: new Date(),
          status: 'pending',
          isLate: false
        });

      }

      const result = { submission: this.mapToSubmission(submission) };

      return result;
    } catch (error) {
      console.error('Repository: Error in submitAssignment:', error);
      console.error('Repository: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
  }

  async getAssignmentStatus(params: GetUserAssignmentStatusRequestDTO, studentId: string): Promise<GetUserAssignmentStatusResponseDTO> {
    const { assignmentId } = params;
    const submission = await SubmissionModel.findOne({ studentId, assignmentId });
    if (!submission) return { status: 'pending' };

    return {
      status: submission.status,
      submittedAt: submission.submittedDate,
      score: submission.marks
    };
  }

  async getAssignmentFeedback(params: GetUserAssignmentFeedbackRequestDTO, studentId: string): Promise<GetUserAssignmentFeedbackResponseDTO> {
    const { assignmentId } = params;
    const submission = await SubmissionModel.findOne({ studentId, assignmentId, status: 'reviewed' });
    if (!submission) throw new Error('Feedback not found');

    return {
      feedback: submission.feedback || '',
      score: submission.marks || 0,
      reviewedAt: submission.reviewedAt || new Date()
    };
  }

  private mapToAssignment(doc: any): Assignment {
    return {
      id: doc._id.toString(),
      title: doc.title,
      subject: doc.subject,
      dueDate: doc.dueDate,
      maxMarks: doc.maxMarks,
      description: doc.description,
      files: doc.files,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      status: doc.status,
      totalSubmissions: doc.totalSubmissions
    };
  }

  private mapToSubmission(doc: any): Submission {
    return {
      id: doc._id.toString(),
      studentId: doc.studentId,
      studentName: doc.studentName,
      assignmentId: doc.assignmentId,
      files: doc.files.map((file: any) => ({
        fileName: file.fileName,
        fileUrl: file.fileUrl,
        fileSize: file.fileSize
      })),
      submittedDate: doc.submittedDate,
      status: doc.status,
      marks: doc.marks,
      feedback: doc.feedback,
      isLate: doc.isLate
    };
  }
} 