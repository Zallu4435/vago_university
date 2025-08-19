import {
  StudentInfoResult,
  IGradeDocument,
  ICourseDocument,
  IAcademicHistoryDocument,
  IProgressDocument,
  IRequirementDocument,
  IEnrollmentDocument,
  ITranscriptRequestDocument,
  IProgramDocument,
  Enrollment,
  ITranscriptRequestInput
} from "../../../domain/academics/entities/Academic";

export interface IAcademicRepository {
  findStudentById(userId: string): Promise<StudentInfoResult | null>;
  findGradeByUserId(userId: string): Promise<IGradeDocument | null>;
  findAllCourses(search?: string, page?: number, limit?: number): Promise<ICourseDocument[]>;
  findAcademicHistory(userId: string, startTerm?: string, endTerm?: string): Promise<IAcademicHistoryDocument[]>;
  findProgramByUserId(userId: string): Promise<IProgramDocument | null>;
  findProgressByUserId(userId: string): Promise<IProgressDocument | null>;
  findRequirementsByUserId(userId: string): Promise<IRequirementDocument | null>;
  findCourseById(courseId: string): Promise<ICourseDocument | null>;
  findEnrollment(studentId: string, courseId: string): Promise<IEnrollmentDocument | null>;
  createEnrollment(enrollment: Enrollment): Promise<IEnrollmentDocument | null>;
  updateCourseEnrollment(courseId: string, increment: number): Promise<ICourseDocument | null>;
  deleteEnrollment(studentId: string, courseId: string): Promise<boolean>;
  createTranscriptRequest(request: ITranscriptRequestInput): Promise<ITranscriptRequestDocument>;
}