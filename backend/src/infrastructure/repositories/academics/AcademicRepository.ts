import mongoose from 'mongoose';
import { IAcademicRepository } from '../../../application/academics/repositories/IAcademicRepository';
import {
  AcademicHistoryFilter,
  CourseFilter,
  Enrollment,
  EnrollmentStatus,
  IAcademicHistoryDocument,
  ICourseDocument,
  IEnrollmentDocument,
  IGradeDocument,
  IProgramDocument,
  IProgressDocument,
  IRequirementDocument,
  ITranscriptRequestDocument,
  IUserDocument,
} from "../../../domain/academics/entities/Academic";
import { User as UserModel } from '../../database/mongoose/auth/user.model';
import { ProgramModel } from '../../database/mongoose/academic/studentProgram.model';
import { EnrollmentModel } from '../../database/mongoose/courses/CourseModel';
import { GradeModel } from '../../database/mongoose/academic/grade.model';
import { CourseModel } from '../../database/mongoose/courses/CourseModel';
import { AcademicHistoryModel } from '../../database/mongoose/academic/academicHistory.model';
import { v4 as uuidv4 } from 'uuid';
import { ProgressModel } from '../../database/mongoose/academic/progress.model';
import { RequirementsModel } from '../../database/mongoose/academic/requirement.model';
import { TranscriptRequestModel } from '../../database/mongoose/academic/transcript.model';
type WithStringId<T> = Omit<T, "_id"> & { _id: string };


export class AcademicRepository implements IAcademicRepository {
  private async getUserById(id: string) {
    return UserModel
      .findById(id)
      .select("_id firstName lastName email phone profilePicture")
      .lean<WithStringId<IUserDocument>>({ getters: true });   
  }

  private async getProgramByStudentId(id: string) {
    return ProgramModel
      .findOne({ studentId: id })
      .select("_id degree catalogYear credits")
      .lean<WithStringId<IProgramDocument>>({ getters: true });
  }

  private async getPendingEnrollmentsByStudentId(
    id: string
  ): Promise<WithStringId<IEnrollmentDocument>[]> {          
    return EnrollmentModel
      .find({ studentId: id, status: /^pending/i })
      .populate({ path: "courseId", select: "credits" })
      .lean<WithStringId<IEnrollmentDocument>[]>({ getters: true }); 
  }

  async findStudentById(userId: string) {
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

  async findGradeByUserId(userId: string) {
    return await GradeModel.findOne({ studentId: userId })
      .select('cumulativeGPA termGPA termName creditsEarned creditsInProgress')
      .lean<WithStringId<IGradeDocument>>({ getters: true });
  }

  async findAllCourses(search?: string, page: number = 1, limit: number = 5) {
    const query: CourseFilter = {};
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
      .lean<WithStringId<ICourseDocument>[]>({ getters: true });
  }

  async findAcademicHistory(userId: string, startTerm?: string, endTerm?: string) {
    const query: AcademicHistoryFilter = { userId };
    if (startTerm) query.term = { $gte: startTerm };
    if (endTerm) query.term = { ...query.term, $lte: endTerm };
    return await AcademicHistoryModel.find(query)
      .select('term credits gpa id')
      .lean<WithStringId<IAcademicHistoryDocument>[]>({ getters: true });
  }

  async findProgramByUserId(userId: string) {
    return await ProgramModel.findOne({ studentId: userId })
      .select('degree catalogYear')
      .lean<WithStringId<IProgramDocument>>({ getters: true });
  }

  async findProgressByUserId(userId: string) {
    return await ProgressModel.findOne({ studentId: userId })
      .select('overallProgress totalCredits completedCredits remainingCredits estimatedGraduation')
      .lean<WithStringId<IProgressDocument>>({ getters: true });
  }

  async findRequirementsByUserId(userId: string) {
    return await RequirementsModel.findOne({ studentId: userId })
      .select('core elective general')
      .lean<WithStringId<IRequirementDocument>>({ getters: true });
  }

  async findCourseById(courseId: string) {
    if (!mongoose.isValidObjectId(courseId)) {
      return null;
    }
    return await CourseModel.findById(courseId)
      .select('title specialization faculty credits schedule term maxEnrollment currentEnrollment description prerequisites')
      .lean<WithStringId<ICourseDocument>>({ getters: true });
  }

  async findEnrollment(studentId: string, courseId: string) {
    if (!mongoose.isValidObjectId(studentId) || !mongoose.isValidObjectId(courseId)) {
      return null;
    }
    return await EnrollmentModel.findOne({
      studentId,
      courseId,
      status: { $in: ['Pending', 'Approved'] },
    }).lean<WithStringId<IEnrollmentDocument>>({ getters: true });
  }

  async createEnrollment(enrollment: Enrollment): Promise<WithStringId<IEnrollmentDocument>> {
    const doc = await new EnrollmentModel({
      _id: new mongoose.Types.ObjectId(),
      studentId: enrollment.studentId,
      courseId: enrollment.courseId,
      status: EnrollmentStatus.Pending,
      reason: enrollment.reason,
      requestedAt: new Date()
    }).save();

    const o = doc.toObject({ getters: true });
    return {
      ...o,
      requestedAt: (o.requestedAt as Date).toISOString()   
    } as WithStringId<IEnrollmentDocument>;
  }

  async updateCourseEnrollment(courseId: string, increment: number) {
    if (!mongoose.isValidObjectId(courseId)) {
      return null;
    }
    const course = await CourseModel.findOneAndUpdate(
      { _id: courseId, currentEnrollment: { $lt: (await CourseModel.findById(courseId)).maxEnrollment } },
      { $inc: { currentEnrollment: increment } },
      { new: true }
    ).lean<WithStringId<ICourseDocument>>({ getters: true });
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

  async createTranscriptRequest(
    request: ITranscriptRequestDocument
  ): Promise<WithStringId<ITranscriptRequestDocument>> {
    const doc = await new TranscriptRequestModel({
      _id: new mongoose.Types.ObjectId(),
      studentId: request.userId,
      deliveryMethod: request.deliveryMethod,
      address: request.address,
      email: request.email,
      requestId: uuidv4(),
      requestedAt: new Date(),                    
      estimatedDelivery: request.estimatedDelivery
    }).save();

    const o = doc.toObject({ getters: true });

    return {
      ...o,
      requestedAt: (o.requestedAt as unknown as Date).toISOString()  
    } as WithStringId<ITranscriptRequestDocument>;
  }
}