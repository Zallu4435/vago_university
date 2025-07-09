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
  async findStudentById(userId: string): Promise<any> {
    try {
      if (!mongoose.isValidObjectId(userId)) {
        return null;
      }
      const user = await UserModel.findById(userId)
        .select('firstName lastName email phone profilePicture')
        .lean();
      if (!user) {
        return null;
      }
      const program = await ProgramModel.findOne({ studentId: userId })
        .select('degree catalogYear credits')
        .lean();
      if (!program) {
        return null;
      }
      const pendingEnrollments = await EnrollmentModel.find({
        studentId: userId,
        status: { $regex: /^pending$/, $options: 'i' },
      })
        .populate({
          path: 'courseId',
          select: 'credits',
        })
        .lean();
      return { user, program, pendingEnrollments };
    } catch (err) {
      console.error(`Error in findStudentById:`, err);
      return null;
    }
  }

  async findGradeByUserId(userId: string): Promise<any> {
    try {
      return await GradeModel.findOne({ studentId: userId })
        .select('cumulativeGPA termGPA termName creditsEarned creditsInProgress')
        .lean();
    } catch (err) {
      console.error('Grade - Error:', err);
      return null;
    }
  }

  async findAllCourses(search?: string, page: number = 1, limit: number = 5): Promise<any[]> {
    try {
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
    } catch (err) {
      console.error(`Error in findAllCourses:`, err);
      return [];
    }
  }

  async findAcademicHistory(userId: string, startTerm?: string, endTerm?: string): Promise<any[]> {
    try {
      const query: any = { userId };
      if (startTerm) query.term = { $gte: startTerm };
      if (endTerm) query.term = { ...query.term, $lte: endTerm };
      return await AcademicHistoryModel.find(query)
        .select('term credits gpa id')
        .lean();
    } catch (err) {
      console.error(`Error in findAcademicHistory:`, err);
      return [];
    }
  }

  async findProgramByUserId(userId: string): Promise<any> {
    try {
      return await ProgramModel.findOne({ studentId: userId })
        .select('degree catalogYear')
        .lean();
    } catch (err) {
      console.error(`Error in findProgramByUserId:`, err);
      return null;
    }
  }

  async findProgressByUserId(userId: string): Promise<any> {
    try {
      return await ProgressModel.findOne({ userId })
        .select('overallProgress totalCredits completedCredits remainingCredits estimatedGraduation')
        .lean();
    } catch (err) {
      console.error('Progress - Error:', err);
      return null;
    }
  }

  async findRequirementsByUserId(userId: string): Promise<any> {
    try {
      return await RequirementsModel.findOne({ userId })
        .select('core elective general')
        .lean();
    } catch (err) {
      console.error(`Error in findRequirementsByUserId:`, err);
      return null;
    }
  }

  async findCourseById(courseId: string): Promise<any> {
    try {
      if (!mongoose.isValidObjectId(courseId)) {
        return null;
      }
      return await CourseModel.findById(courseId)
        .select('title specialization faculty credits schedule term maxEnrollment currentEnrollment description prerequisites')
        .lean();
    } catch (err) {
      console.error(`Error in findCourseById:`, err);
      return null;
    }
  }

  async findEnrollment(studentId: string, courseId: string): Promise<any> {
    try {
      if (!mongoose.isValidObjectId(studentId) || !mongoose.isValidObjectId(courseId)) {
        return null;
      }
      return await EnrollmentModel.findOne({
        studentId,
        courseId,
        status: { $in: ['Pending', 'Approved'] },
      }).lean();
    } catch (err) {
      console.error(`Error in findEnrollment:`, err);
      return null;
    }
  }

  async createEnrollment(enrollment: any): Promise<any> {
    try {
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
    } catch (err) {
      console.error(`Error in createEnrollment:`, err);
      throw new Error(`Failed to create enrollment: ${err.message}`);
    }
  }

  async updateCourseEnrollment(courseId: string, increment: number): Promise<any> {
    try {
      if (!mongoose.isValidObjectId(courseId)) {
        return null;
      }
      const course = await CourseModel.findOneAndUpdate(
        { _id: courseId, currentEnrollment: { $lt: (await CourseModel.findById(courseId)).maxEnrollment } },
        { $inc: { currentEnrollment: increment } },
        { new: true }
      ).lean();
      return course;
    } catch (err) {
      console.error(`Error in updateCourseEnrollment:`, err);
      return null;
    }
  }

  async deleteEnrollment(studentId: string, courseId: string): Promise<boolean> {
    try {
      if (!mongoose.isValidObjectId(studentId) || !mongoose.isValidObjectId(courseId)) {
        return false;
      }
      const result = await EnrollmentModel.findOneAndDelete({
        studentId,
        courseId,
        status: { $in: ['Pending', 'Approved'] },
      }).lean();
      return !!result;
    } catch (err) {
      console.error(`Error in deleteEnrollment:`, err);
      return false;
    }
  }

  async createTranscriptRequest(request: any): Promise<any> {
    try {
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
    } catch (err) {
      console.error(`Error in createTranscriptRequest:`, err);
      throw new Error(`Failed to create transcript request: ${err.message}`);
    }
  }

  async createMeeting(meeting: any): Promise<any> {
    try {
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
    } catch (err) {
      console.error(`Error in createMeeting:`, err);
      throw new Error(`Failed to schedule meeting: ${err.message}`);
    }
  }
}