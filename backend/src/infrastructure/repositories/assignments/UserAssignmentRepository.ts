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

import mongoose from 'mongoose';

export class UserAssignmentRepository implements IUserAssignmentRepository {
  async findUserAssignmentsRaw(query: any, sortField: string, sortOrder: 1 | -1) {
    return AssignmentModel.find(query).sort({ [sortField]: sortOrder });
  }

  async getAssignments(params: GetUserAssignmentsRequestDTO, studentId: string): Promise<any> {
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
    const assignments = await this.findUserAssignmentsRaw(query, sortField, sortOrder);
    return { assignments, page, limit, status, studentId };
  }

  async getAssignmentById(params: GetUserAssignmentByIdRequestDTO, studentId: string): Promise<any> {
    const { id } = params;
    const assignment = await AssignmentModel.findOne({ _id: id, status: 'published' });
    const submission = await SubmissionModel.findOne({ assignmentId: id, studentId: studentId }).lean();
    return { assignment, submission };
  }

  async submitAssignment(params: SubmitUserAssignmentRequestDTO, studentId: string): Promise<any> {
    const { assignmentId, file } = params;
    const student = await mongoose.model('User').findOne({ _id: studentId });
    const existingSubmission = await SubmissionModel.findOne({ assignmentId, studentId });
    let submission;
    if (existingSubmission) {
      submission = await SubmissionModel.findOneAndUpdate(
        { assignmentId, studentId },
        {
          files: [{
            fileName: file.originalname,
            fileUrl: file.path,
            fileSize: file.size
          }],
          submittedDate: new Date(),
          status: existingSubmission.status,
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
        studentName: student ? `${student.firstName} ${student.lastName}` : '',
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
    return { submission };
  }

  async getAssignmentStatus(params: GetUserAssignmentStatusRequestDTO, studentId: string): Promise<any> {
    const { assignmentId } = params;
    const submission = await SubmissionModel.findOne({ studentId, assignmentId });
    return { submission };
  }

  async getAssignmentFeedback(params: GetUserAssignmentFeedbackRequestDTO, studentId: string): Promise<any> {
    const { assignmentId } = params;
    const submission = await SubmissionModel.findOne({ studentId, assignmentId, status: 'reviewed' });
    return { submission };
  }
} 