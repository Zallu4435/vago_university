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
import { User as UserModel } from '../../../infrastructure/database/mongoose/models/user.model';
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
  async findStudentById(userId: string): Promise<Student | null> {
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
      const pendingCredits = pendingEnrollments
        .filter((enrollment) => enrollment.courseId)
        .reduce((sum, enrollment) => sum + ((enrollment.courseId as any).credits || 0), 0);

      // Get academic standing from user's academic status
      const academicStanding = 'Good';
      // Get advisor from user's advisor field
      const advisor = 'Unknown';

      return new Student(
        userId,
        user.firstName,
        user.lastName,
        user.email,
        program.degree,
        program.catalogYear,
        'Good',
        'Unknown',
        pendingCredits,
        program.credits || 0,
        user.phone?.toString(),
        user.profilePicture
      );
    } catch (err) {
      console.error(`Error in findStudentById:`, err);
      return null;
    }
  }

  async findGradeByUserId(userId: string): Promise<Grade | null> {
    try {
      const grade = await GradeModel.findOne({ studentId: userId })
        .select('cumulativeGPA termGPA termName creditsEarned creditsInProgress')
        .lean();
      
      if (!grade) {
        return null;
      }

      return new Grade(
        new mongoose.Types.ObjectId().toString(),
        userId,
        '',
        grade.cumulativeGPA || 'N/A',
        grade.termGPA || 'N/A',
        '',
        grade.termName || 'Unknown Term',
        '',
        grade.creditsEarned || '0',
        grade.creditsInProgress || '0',
        new Date().toISOString()
      );
    } catch (err) {
      console.error('Grade - Error:', err);
      return null;
    }
  }

  async findAllCourses(search?: string, page: number = 1, limit: number = 5): Promise<Course[]> {
    try {
      const query: any = {};
      
      if (search && search.trim()) {
        // Search across multiple fields using regex for better flexibility
        const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        query.$or = [
          { title: searchRegex },
          { specialization: searchRegex },
          { faculty: searchRegex },
          { description: searchRegex }
        ];
      }

      const skip = (page - 1) * limit;
      const courses = await CourseModel.find(query)
        .select('title specialization faculty credits schedule term maxEnrollment currentEnrollment description prerequisites')
        .sort(search ? {} : { createdAt: -1 }) // Sort by newest first when no search
        .skip(skip)
        .limit(limit)
        .lean();
        
      return courses.map((course) => new Course(
        course._id.toString(),
        course.title,
        course.specialization,
        course.faculty,
        course.credits,
        course.term || '',
        course.maxEnrollment || 0,
        course.currentEnrollment || 0,
        new Date().toISOString(),
        course.schedule,
        course.description,
        course.prerequisites
      ));
    } catch (err) {
      console.error(`Error in findAllCourses:`, err);
      return [];
    }
  }

  async findAcademicHistory(userId: string, startTerm?: string, endTerm?: string): Promise<AcademicHistory[]> {
    try {
      const query: any = { userId };
      if (startTerm) query.term = { $gte: startTerm };
      if (endTerm) query.term = { ...query.term, $lte: endTerm };
      const history = await AcademicHistoryModel.find(query)
        .select('term credits gpa id')
        .lean();
      return history.map((record) => new AcademicHistory(
        record.id,
        userId,
        record.term,
        record.credits,
        record.gpa,
        ''
      ));
    } catch (err) {
      console.error(`Error in findAcademicHistory:`, err);
      return [];
    }
  }

  async findProgramByUserId(userId: string): Promise<Program | null> {
    try {
      const program = await ProgramModel.findOne({ studentId: userId })
        .select('degree catalogYear')
        .lean();
      if (!program) {
        return null;
      }
      return new Program(
        new mongoose.Types.ObjectId().toString(),
        userId,
        program.degree,
        program.catalogYear,
        new Date().toISOString()
      );
    } catch (err) {
      console.error(`Error in findProgramByUserId:`, err);
      return null;
    }
  }

  async findProgressByUserId(userId: string): Promise<Progress | null> {
    try {
      const progress = await ProgressModel.findOne({ userId })
        .select('overallProgress totalCredits completedCredits remainingCredits estimatedGraduation')
        .lean();
      
      if (!progress) {
        return null;
      }

      return new Progress(
        new mongoose.Types.ObjectId().toString(),
        userId,
        progress.overallProgress || 0,
        progress.totalCredits || 0,
        progress.completedCredits || 0,
        progress.remainingCredits || 0,
        progress.estimatedGraduation || 'To be determined',
        new Date().toISOString()
      );
    } catch (err) {
      console.error('Progress - Error:', err);
      return null;
    }
  }

  async findRequirementsByUserId(userId: string): Promise<Requirement | null> {
    try {
      const requirements = await RequirementsModel.findOne({ userId })
        .select('core elective general')
        .lean();
      if (!requirements) {
        return null;
      }
      return new Requirement(
        new mongoose.Types.ObjectId().toString(),
        userId,
        requirements.core || { percentage: 0, completed: 0, total: 0 },
        requirements.elective || { percentage: 0, completed: 0, total: 0 },
        requirements.general || { percentage: 0, completed: 0, total: 0 },
        new Date().toISOString()
      );
    } catch (err) {
      console.error(`Error in findRequirementsByUserId:`, err);
      return null;
    }
  }

  async findCourseById(courseId: string): Promise<Course | null> {
    try {
      if (!mongoose.isValidObjectId(courseId)) {
        return null;
      }
      const course = await CourseModel.findById(courseId)
        .select('title specialization faculty credits schedule term maxEnrollment currentEnrollment description prerequisites')
        .lean();
      if (!course) {
        return null;
      }
      return new Course(
        course._id.toString(),
        course.title,
        course.specialization,
        course.faculty,
        course.credits,
        course.term || '',
        course.maxEnrollment || 0,
        course.currentEnrollment || 0,
        new Date().toISOString(),
        course.schedule,
        course.description,
        course.prerequisites
      );
    } catch (err) {
      console.error(`Error in findCourseById:`, err);
      return null;
    }
  }

  async findEnrollment(studentId: string, courseId: string): Promise<Enrollment | null> {
    try {
      if (!mongoose.isValidObjectId(studentId) || !mongoose.isValidObjectId(courseId)) {
        return null;
      }
      const enrollment = await EnrollmentModel.findOne({
        studentId,
        courseId,
        status: { $in: ['Pending', 'Approved'] },
      }).lean();
      if (!enrollment) {
        return null;
      }
      return new Enrollment(
        enrollment._id.toString(),
        enrollment.studentId.toString(),
        enrollment.courseId.toString(),
        enrollment.status as EnrollmentStatus,
        enrollment.requestedAt.toISOString(),
        enrollment.reason
      );
    } catch (err) {
      console.error(`Error in findEnrollment:`, err);
      return null;
    }
  }

  async createEnrollment(enrollment: Enrollment): Promise<Enrollment> {
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
      return enrollment;
    } catch (err) {
      console.error(`Error in createEnrollment:`, err);
      throw new Error(`Failed to create enrollment: ${err.message}`);
    }
  }

  async updateCourseEnrollment(courseId: string, increment: number): Promise<Course | null> {
    try {
      if (!mongoose.isValidObjectId(courseId)) {
        return null;
      }
      const course = await CourseModel.findOneAndUpdate(
        { _id: courseId, currentEnrollment: { $lt: (await CourseModel.findById(courseId)).maxEnrollment } },
        { $inc: { currentEnrollment: increment } },
        { new: true }
      ).lean();
      if (!course) {
        return null;
      }
      return new Course(
        course._id.toString(),
        course.title,
        course.specialization,
        course.faculty,
        course.credits,
        course.term,
        course.maxEnrollment || 0,
        course.currentEnrollment || 0,
        new Date().toISOString()
      );
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

  async createTranscriptRequest(request: TranscriptRequest): Promise<TranscriptRequest> {
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
      return request;
    } catch (err) {
      console.error(`Error in createTranscriptRequest:`, err);
      throw new Error(`Failed to create transcript request: ${err.message}`);
    }
  }

  async createMeeting(meeting: Meeting): Promise<Meeting> {
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
      return meeting;
    } catch (err) {
      console.error(`Error in createMeeting:`, err);
      throw new Error(`Failed to schedule meeting: ${err.message}`);
    }
  }
}