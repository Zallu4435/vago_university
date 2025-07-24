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
  } from "../../../domain/academics/entities/Academic";
  
  export type StudentInfoResult = { user: any; program: any; pendingEnrollments: any[] };

  export interface IAcademicRepository {
    findStudentById(userId: string): Promise<StudentInfoResult | null>;
    findGradeByUserId(userId: string): Promise<Grade | null>;
    findAllCourses(search?: string, page?: number, limit?: number): Promise<Course[]>;
    findAcademicHistory(userId: string, startTerm?: string, endTerm?: string): Promise<AcademicHistory[]>;
    findProgramByUserId(userId: string): Promise<Program | null>;
    findProgressByUserId(userId: string): Promise<Progress | null>;
    findRequirementsByUserId(userId: string): Promise<Requirement | null>;
    findCourseById(courseId: string): Promise<Course | null>;
    findEnrollment(studentId: string, courseId: string): Promise<Enrollment | null>;
    createEnrollment(enrollment: Enrollment): Promise<Enrollment>;
    updateCourseEnrollment(courseId: string, increment: number): Promise<Course | null>;
    deleteEnrollment(studentId: string, courseId: string): Promise<boolean>;
    createTranscriptRequest(request: TranscriptRequest): Promise<TranscriptRequest>;
    createMeeting(meeting: Meeting): Promise<Meeting>;
  }