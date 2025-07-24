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


export class AssignmentRepository implements IAssignmentRepository {
  async findAssignmentsRaw(query: any, skip: number, limit: number) {
    return AssignmentModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async getAssignments(params: GetAssignmentsRequestDTO & { search?: string }): Promise<any> {
    const { subject, status, page = 1, limit = 10, search } = params;
    const query: any = {};
    if (subject) query.subject = subject;
    if (status) query.status = status;
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }
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
    console.log('getAnalytics called in AssignmentRepository');
    // Total assignments
    const totalAssignments = await AssignmentModel.countDocuments();
    // Total submissions
    const totalSubmissions = await SubmissionModel.countDocuments();
    // Submission rate (submissions/assignments, capped at 1)
    const submissionRate = totalAssignments > 0 ? Math.min(totalSubmissions / totalAssignments, 1) : 0;
    // Average submission time (in hours, from assignment creation to submission)
    const submissions = await SubmissionModel.find().lean();
    const assignments = await AssignmentModel.find().lean();
    let totalHours = 0;
    let countWithTime = 0;
    const assignmentMap = new Map(assignments.map(a => [a._id.toString(), a]));
    for (const sub of submissions) {
      const assignment = assignmentMap.get(sub.assignmentId.toString());
      if (assignment && assignment.createdAt && sub.submittedDate) {
        const hours = (new Date(sub.submittedDate).getTime() - new Date(assignment.createdAt).getTime()) / (1000 * 60 * 60);
        totalHours += hours;
        countWithTime++;
      }
    }
    const averageSubmissionTimeHours = countWithTime > 0 ? totalHours / countWithTime : 0;
    // Subject distribution
    const subjectDistribution: Record<string, number> = {};
    for (const a of assignments) {
      subjectDistribution[a.subject] = (subjectDistribution[a.subject] || 0) + 1;
    }
    // Status distribution
    const statusDistribution: Record<string, number> = {};
    for (const s of submissions) {
      statusDistribution[s.status] = (statusDistribution[s.status] || 0) + 1;
    }
    // Recent submissions (last 5)
    const recentSubmissions = (await SubmissionModel.find().sort({ submittedDate: -1 }).limit(5).lean()).map(s => ({
      assignmentTitle: assignmentMap.get(s.assignmentId.toString())?.title || '',
      studentName: s.studentName,
      submittedAt: s.submittedDate,
      score: s.marks || 0
    }));
    // Top performers (top 5 by average score, min 1 submission)
    const studentScores: Record<string, { studentName: string; totalScore: number; count: number }> = {};
    for (const s of submissions) {
      if (!studentScores[s.studentId]) {
        studentScores[s.studentId] = { studentName: s.studentName, totalScore: 0, count: 0 };
      }
      if (typeof s.marks === 'number') {
        studentScores[s.studentId].totalScore += s.marks;
        studentScores[s.studentId].count++;
      }
    }
    const topPerformers = Object.entries(studentScores)
      .filter(([_, v]) => v.count > 0)
      .map(([studentId, v]) => ({
        studentId,
        studentName: v.studentName,
        averageScore: v.totalScore / v.count,
        submissionsCount: v.count
      }))
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 5);
    return {
      totalAssignments,
      totalSubmissions,
      submissionRate,
      averageSubmissionTimeHours,
      subjectDistribution,
      statusDistribution,
      recentSubmissions,
      topPerformers
    };
  }
} 