import { IAssignmentRepository } from '../../../application/assignments/repositories/IAssignmentRepository';
import { AssignmentModel } from '../../database/mongoose/assignment/AssignmentModel';
import { SubmissionModel } from '../../database/mongoose/assignment/SubmissionModel';
import { Assignment, AssignmentFilter, IAssignment } from '../../../domain/assignments/entities/Assignment';

export class AssignmentRepository implements IAssignmentRepository {
  async findAssignmentsRaw(query, skip: number, limit: number) {
    return AssignmentModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async getAssignments(subject: string, status: string, page: number, limit: number, search: string) {
    const query: AssignmentFilter = {};
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

  async getAssignmentById(id: string) {
    return AssignmentModel.findById(id);
  }

  async getSubmissionsStats(assignmentIds: string[]) {
    const mongoose = require('mongoose');
    const objectIds = assignmentIds.map(id => new mongoose.Types.ObjectId(id));
    
    const submissionsAggregation = await SubmissionModel.aggregate([
      { $match: { assignmentId: { $in: objectIds } } },
      { $group: {
        _id: '$assignmentId',
        totalSubmissions: { $sum: 1 },
        totalMarks: { $sum: { $cond: [{ $isNumber: '$marks' }, '$marks', 0] } },
        gradedSubmissions: { $sum: { $cond: [{ $isNumber: '$marks' }, 1, 0] } }
      }},
      { $addFields: {
        _id: { $toString: '$_id' }
      }}
    ]);
    
    return submissionsAggregation;
  }

  async createAssignment(assignment: Assignment) {
    return AssignmentModel.create(assignment);
  }

  async updateAssignment(id: string, assignment: Partial<IAssignment>): Promise<IAssignment | null> {
    return AssignmentModel.findByIdAndUpdate(
      id,
      { $set: assignment },
      { new: true }
    ).lean<IAssignment>().exec();
  }

  async deleteAssignment(id: string) {
    return AssignmentModel.findByIdAndDelete(id);
  }

  async getSubmissions(assignmentId: string, page: number, limit: number, search?: string, status?: string) {
    const skip = (page - 1) * limit;
    
    const filterQuery: any = { assignmentId };
    
    if (status) {
      filterQuery.status = status;
    }
    
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filterQuery.$or = [
        { studentName: searchRegex },
        { feedback: searchRegex },
        { 'files.fileName': searchRegex }
      ];
    }
    
    const sortQuery: any = { submittedDate: -1 };
    
    const [submissions, total] = await Promise.all([
      SubmissionModel.find(filterQuery)
        .skip(skip)
        .limit(limit)
        .sort(sortQuery),
      SubmissionModel.countDocuments(filterQuery)
    ]);
    
    return { submissions, total, page, limit };
  }

  async getSubmissionById(assignmentId: string, submissionId: string) {
    return SubmissionModel.findOne({
      _id: submissionId,
      assignmentId
    });
  }

  async reviewSubmission(assignmentId: string, submissionId: string, marks: number, feedback: string, status: string, isLate: boolean) {
    try {
      const existingSubmission = await SubmissionModel.findOne({ _id: submissionId, assignmentId });
      if (!existingSubmission) {
        return null;
      }
      
      const updatedSubmission = await SubmissionModel.findOneAndUpdate(
        { _id: submissionId, assignmentId },
        { 
          $set: { 
            marks, 
            feedback, 
            status, 
            isLate,
            reviewedAt: new Date() 
          } 
        },
        { new: true, runValidators: true }
      );
      
      return updatedSubmission;
    } catch (error) {
      console.error('Error in reviewSubmission:', error);
      throw error;
    }
  }

  async downloadSubmission(assignmentId: string, submissionId: string) {
    return SubmissionModel.findOne({
      _id: submissionId,
      assignmentId
    });
  }

  async getAnalytics() {
    const totalAssignments = await AssignmentModel.countDocuments();

    const totalSubmissions = await SubmissionModel.countDocuments();

    const submissionRate = totalAssignments > 0 ? Math.min(totalSubmissions / totalAssignments, 1) : 0;

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

    const subjectDistribution: Record<string, number> = {};
    for (const a of assignments) {
      subjectDistribution[a.subject] = (subjectDistribution[a.subject] || 0) + 1;
    }

    const statusDistribution: Record<string, number> = {};
    for (const s of submissions) {
      statusDistribution[s.status] = (statusDistribution[s.status] || 0) + 1;
    }
    const recentSubmissions = (await SubmissionModel.find().sort({ submittedDate: -1 }).limit(5).lean()).map(s => ({
      assignmentTitle: assignmentMap.get(s.assignmentId.toString())?.title || '',
      studentName: s.studentName,
      submittedAt: s.submittedDate,
      score: s.marks || 0
    }));

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