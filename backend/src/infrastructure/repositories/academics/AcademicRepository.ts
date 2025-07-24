import mongoose from 'mongoose';
import { IAcademicRepository } from '../../../application/academics/repositories/IAcademicRepository';
import {
  Student,
  Grade,
  Course,
  AcademicHistory,
  Program,
  Progress,
  Requirement,
  Enrollment,
  TranscriptRequest,
  Meeting,
  EnrollmentStatus,
} from "../../../domain/academics/entities/Academic";
import { User as UserModel } from '../../database/mongoose/auth/user.model';
import { ProgramModel } from '../../../infrastructure/database/mongoose/models/studentProgram.model';
import { EnrollmentModel } from '../../../infrastructure/database/mongoose/models/courses/CourseModel';
import { GradeModel } from '../../../infrastructure/database/mongoose/models/grade.model';
import { CourseModel } from '../../../infrastructure/database/mongoose/models/courses/CourseModel';
import { AcademicHistoryModel } from '../../../infrastructure/database/mongoose/models/academicHistory.model';
import { ProgressModel } from '../../../infrastructure/database/mongoose/models/progress.model';
import { RequirementsModel } from '../../../infrastructure/database/mongoose/models/requirement.model';
import { TranscriptRequestModel } from '../../../infrastructure/database/mongoose/models/transcript.model';
import { MeetingModel } from '../../../infrastructure/database/mongoose/models/meeting.model';

export class AcademicRepository implements IAcademicRepository {
  async getUserById(userId: string): Promise<any> {
    return await UserModel.findById(userId)
      .select('firstName lastName email phone profilePicture')
      .lean();
  }

  async getProgramByStudentId(userId: string): Promise<any> {
    return await ProgramModel.findOne({ studentId: userId })
      .select('degree catalogYear credits')
      .lean();
  }

  async getPendingEnrollmentsByStudentId(userId: string): Promise<any[]> {
    return await EnrollmentModel.find({
      studentId: userId,
      status: { $regex: /^pending$/, $options: 'i' },
    })
      .populate({
        path: 'courseId',
        select: 'credits',
      })
      .lean();
  }

  async findStudentById(userId: string): Promise<any> {
    if (!mongoose.isValidObjectId(userId)) {
      return null;
    }
    const user = await this.getUserById(userId);
    if (!user) {
      return null;
    }
    const program = await this.getProgramByStudentId(userId);
    if (!program) {
      return null;
    }
    const pendingEnrollments = await this.getPendingEnrollmentsByStudentId(userId);
    return { user, program, pendingEnrollments };
  }

  async findGradeByUserId(userId: string): Promise<any> {
    return await GradeModel.findOne({ studentId: userId })
      .select('cumulativeGPA termGPA termName creditsEarned creditsInProgress')
      .lean();
  }

  async findAllCourses(search?: string, page: number = 1, limit: number = 5): Promise<any[]> {
    const query: any = {};
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [
        { title: searchRegex },
        { specialization: searchRegex },
        { faculty: searchRegex },
        { description: searchRegex }
      ];
    }
    const skip = (page - 1) * limit;
    return await CourseModel.find(query)
      .select('title specialization faculty credits schedule term maxEnrollment currentEnrollment description prerequisites')
      .sort(search ? {} : { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async findAcademicHistory(userId: string, startTerm?: string, endTerm?: string): Promise<any[]> {
    const query: any = { userId };
    if (startTerm) query.term = { $gte: startTerm };
    if (endTerm) query.term = { ...query.term, $lte: endTerm };
    return await AcademicHistoryModel.find(query)
      .select('term credits gpa id')
      .lean();
  }

  async findProgramByUserId(userId: string): Promise<any> {
    return await ProgramModel.findOne({ studentId: userId })
      .select('degree catalogYear')
      .lean();
  }

  async findProgressByUserId(userId: string): Promise<any> {
    return await ProgressModel.findOne({ userId })
      .select('overallProgress totalCredits completedCredits remainingCredits estimatedGraduation')
      .lean();
  }

  async findRequirementsByUserId(userId: string): Promise<any> {
    return await RequirementsModel.findOne({ userId })
      .select('core elective general')
      .lean();
  }

  async findCourseById(courseId: string): Promise<any> {
    if (!mongoose.isValidObjectId(courseId)) {
      return null;
    }
    return await CourseModel.findById(courseId)
      .select('title specialization faculty credits schedule term maxEnrollment currentEnrollment description prerequisites')
      .lean();
  }

  async findEnrollment(studentId: string, courseId: string): Promise<any> {
    if (!mongoose.isValidObjectId(studentId) || !mongoose.isValidObjectId(courseId)) {
      return null;
    }
    return await EnrollmentModel.findOne({
      studentId,
      courseId,
      status: { $in: ['Pending', 'Approved'] },
    }).lean();
  }

  async createEnrollment(enrollment: any): Promise<any> {
    const newEnrollment = new EnrollmentModel({
      _id: new mongoose.Types.ObjectId(enrollment.id),
      studentId: enrollment.studentId,
      courseId: enrollment.courseId,
      status: EnrollmentStatus.Pending,
      reason: enrollment.reason,
      requestedAt: new Date(),
    });
    await newEnrollment.save();
    return newEnrollment.toObject();
  }

  async updateCourseEnrollment(courseId: string, increment: number): Promise<any> {
    if (!mongoose.isValidObjectId(courseId)) {
      return null;
    }
    const course = await CourseModel.findOneAndUpdate(
      { _id: courseId, currentEnrollment: { $lt: (await CourseModel.findById(courseId)).maxEnrollment } },
      { $inc: { currentEnrollment: increment } },
      { new: true }
    ).lean();
    return course;
  }

  async deleteEnrollment(studentId: string, courseId: string): Promise<boolean> {
    if (!mongoose.isValidObjectId(studentId) || !mongoose.isValidObjectId(courseId)) {
      return false;
    }
    const result = await EnrollmentModel.findOneAndDelete({
      studentId,
      courseId,
      status: { $in: ['Pending', 'Approved'] },
    }).lean();
    return !!result;
  }

  async createTranscriptRequest(request: any): Promise<any> {
    const newRequest = new TranscriptRequestModel({
      _id: new mongoose.Types.ObjectId(request.id),
      userId: request.userId,
      deliveryMethod: request.deliveryMethod,
      address: request.address,
      email: request.email,
      requestId: request.id,
      estimatedDelivery: request.estimatedDelivery,
    });
    await newRequest.save();
    return newRequest.toObject();
  }

  async createMeeting(meeting: any): Promise<any> {
    const newMeeting = new MeetingModel({
      _id: new mongoose.Types.ObjectId(meeting.id),
      userId: meeting.userId,
      date: meeting.date,
      reason: meeting.reason,
      preferredTime: meeting.preferredTime,
      notes: meeting.notes,
      meetingId: meeting.id,
      meetingTime: meeting.meetingTime,
      location: meeting.location,
    });
    await newMeeting.save();
    return newMeeting.toObject();
  }
}