import { IUserAssignmentRepository } from '../../../application/assignments/repositories/IUserAssignmentRepository';
import { AssignmentModel } from '../../database/mongoose/assignment/AssignmentModel';
import { SubmissionModel } from '../../database/mongoose/assignment/SubmissionModel';
import mongoose from 'mongoose';

export class UserAssignmentRepository implements IUserAssignmentRepository {
  async findUserAssignmentsRaw(query: any, sortField: string, sortOrder: 1 | -1) {
    return AssignmentModel.find(query).sort({ [sortField]: sortOrder });
  }
 
  async getAssignments(subject: string, status: string, page: number, limit: number, search: string, studentId: string, sortBy: string) {
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

  async getAssignmentById(id: string, studentId: string) {
    const assignment = await AssignmentModel.findOne({ _id: id, status: 'published' });
    const submission = await SubmissionModel.findOne({ assignmentId: id, studentId: studentId }).lean();
    return { assignment, submission };
  }

  async submitAssignment(assignmentId: string, files: any[], studentId: string) {
    const student = await mongoose.model('User').findOne({ _id: studentId });
    const existingSubmission = await SubmissionModel.findOne({ assignmentId, studentId });
    let submission;
    if (existingSubmission) {
      submission = await SubmissionModel.findOneAndUpdate(
        { assignmentId, studentId },
        {
          files: files.map((file: any) => ({
            fileName: file.originalname,
            fileUrl: file.path,
            fileSize: file.size
          })),
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
        files: files.map((file: any) => ({
          fileName: file.originalname,
          fileUrl: file.path,
          fileSize: file.size
        })),
        submittedDate: new Date(),
        status: 'pending',
        isLate: false
      });
    }
    return { submission };
  }

  async getAssignmentStatus(assignmentId: string, studentId: string) {
    const submission = await SubmissionModel.findOne({ studentId, assignmentId });
    return { submission };
  }

  async getAssignmentFeedback(assignmentId: string, studentId: string) {
    const submission = await SubmissionModel.findOne({ studentId, assignmentId, status: 'reviewed' });
    return { submission };
  }
} 