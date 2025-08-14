import {
  GetStudentInfoRequestDTO,
  GetStudentInfoResponseDTO,
  GetGradeInfoRequestDTO,
  GetGradeInfoResponseDTO,
  GetCoursesRequestDTO,
  GetCoursesResponseDTO,
  GetAcademicHistoryRequestDTO,
  GetAcademicHistoryResponseDTO,
  GetProgramInfoRequestDTO,
  GetProgramInfoResponseDTO,
  GetProgressInfoRequestDTO,
  GetProgressInfoResponseDTO,
  GetRequirementsInfoRequestDTO,
  GetRequirementsInfoResponseDTO,
  RegisterCourseRequestDTO,
  RegisterCourseResponseDTO,
  DropCourseRequestDTO,
  DropCourseResponseDTO,
  RequestTranscriptRequestDTO,
  RequestTranscriptResponseDTO,
} from "../../../domain/academics/dtos/AcademicDTOs";
import { IAcademicRepository } from "../repositories/IAcademicRepository";
import {
  EnrollmentStatus,
  ICourseDocument,
  IEnrollmentDocument,
  StudentInfoResult,
} from "../../../domain/academics/entities/Academic";

interface ResponseDTO<T> {
  data: T | { error: string };
  success: boolean;
}

export interface IGetStudentInfoUseCase {
  execute(input: GetStudentInfoRequestDTO): Promise<ResponseDTO<GetStudentInfoResponseDTO>>;
}

export interface IGetGradeInfoUseCase {
  execute(input: GetGradeInfoRequestDTO): Promise<ResponseDTO<GetGradeInfoResponseDTO>>;
}

export interface IGetCoursesUseCase {
  execute(input: GetCoursesRequestDTO): Promise<ResponseDTO<GetCoursesResponseDTO>>;
}

export interface IGetAcademicHistoryUseCase {
  execute(input: GetAcademicHistoryRequestDTO): Promise<ResponseDTO<GetAcademicHistoryResponseDTO>>;
}

export interface IGetProgramInfoUseCase {
  execute(input: GetProgramInfoRequestDTO): Promise<ResponseDTO<GetProgramInfoResponseDTO>>;
}

export interface IGetProgressInfoUseCase {
  execute(input: GetProgressInfoRequestDTO): Promise<ResponseDTO<GetProgressInfoResponseDTO>>;
}

export interface IGetRequirementsInfoUseCase {
  execute(input: GetRequirementsInfoRequestDTO): Promise<ResponseDTO<GetRequirementsInfoResponseDTO>>;
}

export interface IRegisterCourseUseCase {
  execute(input: RegisterCourseRequestDTO): Promise<ResponseDTO<RegisterCourseResponseDTO>>;
}

export interface IDropCourseUseCase {
  execute(input: DropCourseRequestDTO): Promise<ResponseDTO<DropCourseResponseDTO>>;
}

export interface IRequestTranscriptUseCase {
  execute(input: RequestTranscriptRequestDTO): Promise<ResponseDTO<RequestTranscriptResponseDTO>>;
}

export class GetStudentInfoUseCase implements IGetStudentInfoUseCase {
  constructor(private academicRepository: IAcademicRepository) { }

  async execute(input: GetStudentInfoRequestDTO): Promise<ResponseDTO<GetStudentInfoResponseDTO>> {
    const result: StudentInfoResult | null = await this.academicRepository.findStudentById(input.userId);
    if (!result) {
      return { data: { error: "Student not found" }, success: false };
    }
    const { user, program, pendingEnrollments } = result;
    const pendingCredits = (
      await Promise.all(
        pendingEnrollments
          .filter((enrollment: IEnrollmentDocument) => Boolean(enrollment.courseId))
          .map(async (enrollment: IEnrollmentDocument) => {
            const course = await this.academicRepository.findCourseById(enrollment.courseId);
            return course?.credits ?? 0;
          })
      )
    ).reduce((sum: number, credits: number) => sum + credits, 0);
    const academicStanding = 'Good';
    const advisor = 'Unknown';
    const response: GetStudentInfoResponseDTO = {
      name: `${user.firstName} ${user.lastName}`,
      id: input.userId,
      email: user.email,
      phone: user.phone?.toString(),
      profilePicture: user.profilePicture,
      major: program.degree,
      catalogYear: program.catalogYear,
      academicStanding,
      advisor,
      pendingCredits,
      credits: program.credits || 0
    };
    return { data: response, success: true };
  }
}

export class GetGradeInfoUseCase implements IGetGradeInfoUseCase {
  constructor(private academicRepository: IAcademicRepository) { }

  async execute(input: GetGradeInfoRequestDTO): Promise<ResponseDTO<GetGradeInfoResponseDTO>> {
    const grade = await this.academicRepository.findGradeByUserId(input.userId);
    if (!grade) {
      return { data: { error: "Grade information not found" }, success: false };
    }
    const response: GetGradeInfoResponseDTO = {
      cumulativeGPA: grade.cumulativeGPA || 'N/A',
      termGPA: grade.termGPA || 'N/A',
      termName: grade.termName || 'Unknown Term',
      creditsEarned: grade.creditsEarned || '0',
      creditsInProgress: grade.creditsInProgress || '0'
    };
    return { data: response, success: true };
  }
}

export class GetCoursesUseCase implements IGetCoursesUseCase {
  constructor(private academicRepository: IAcademicRepository) { }

  async execute(input: GetCoursesRequestDTO & { userId?: string }): Promise<ResponseDTO<GetCoursesResponseDTO>> {
    const { search, page = 1, limit = 5, userId } = input;
    const courses = await this.academicRepository.findAllCourses(search, page, limit);
    let mappedCourses;
    if (userId) {
      mappedCourses = await Promise.all(
        courses.map(async (course: ICourseDocument) => {
          const enrollment = await this.academicRepository.findEnrollment(userId, course._id.toString());
          return {
            id: course._id?.toString() || '',
            title: course.title,
            specialization: course.specialization,
            faculty: course.faculty,
            credits: course.credits,
            term: course.term || '',
            maxEnrollment: course.maxEnrollment || 0,
            currentEnrollment: course.currentEnrollment || 0,
            createdAt: course.createdAt ? new Date(course.createdAt).toISOString() : new Date().toISOString(),
            schedule: course.schedule,
            description: course.description,
            prerequisites: course.prerequisites,
            joined: !!enrollment,
          };
        })
      );
    } else {
      mappedCourses = courses.map((course: ICourseDocument) => ({
        id: course._id?.toString() || '',
        title: course.title,
        specialization: course.specialization,
        faculty: course.faculty,
        credits: course.credits,
        term: course.term || '',
        maxEnrollment: course.maxEnrollment || 0,
        currentEnrollment: course.currentEnrollment || 0,
        createdAt: course.createdAt ? new Date(course.createdAt).toISOString() : new Date().toISOString(),
        schedule: course.schedule,
        description: course.description,
        prerequisites: course.prerequisites,
        joined: false,
      }));
    }
    const response: GetCoursesResponseDTO = {
      courses: mappedCourses,
      totalCourses: mappedCourses.length,
      totalPages: 1,
      currentPage: page
    };
    return { data: response, success: true };
  }
}

export class GetAcademicHistoryUseCase implements IGetAcademicHistoryUseCase {
  constructor(private academicRepository: IAcademicRepository) { }

  async execute(input: GetAcademicHistoryRequestDTO): Promise<ResponseDTO<GetAcademicHistoryResponseDTO>> {
    const history = await this.academicRepository.findAcademicHistory(input.userId, input.startTerm, input.endTerm);
    const response: GetAcademicHistoryResponseDTO = {
      history: history.map((record) => ({
        term: record.term,
        credits: record.credits,
        gpa: record.gpa,
        id: record.id
      }))
    };
    return { data: response, success: true };
  }
}

export class GetProgramInfoUseCase implements IGetProgramInfoUseCase {
  constructor(private academicRepository: IAcademicRepository) { }

  async execute(input: GetProgramInfoRequestDTO): Promise<ResponseDTO<GetProgramInfoResponseDTO>> {
    const program = await this.academicRepository.findProgramByUserId(input.userId);
    if (!program) {
      return { data: { error: "Program information not found" }, success: false };
    }
    const response: GetProgramInfoResponseDTO = {
      degree: program.degree,
      catalogYear: program.catalogYear
    };
    return { data: response, success: true };
  }
}

export class GetProgressInfoUseCase implements IGetProgressInfoUseCase {
  constructor(private academicRepository: IAcademicRepository) { }

  async execute(input: GetProgressInfoRequestDTO): Promise<ResponseDTO<GetProgressInfoResponseDTO>> {
    const progress = await this.academicRepository.findProgressByUserId(input.userId);
    if (!progress) {
      return { data: { error: "Progress information not found" }, success: false };
    }
    const response: GetProgressInfoResponseDTO = {
      overallProgress: progress.overallProgress || 0,
      totalCredits: progress.totalCredits || 0,
      completedCredits: progress.completedCredits || 0,
      remainingCredits: progress.remainingCredits || 0,
      estimatedGraduation: progress.estimatedGraduation || 'To be determined'
    };
    return { data: response, success: true };
  }
}

export class GetRequirementsInfoUseCase implements IGetRequirementsInfoUseCase {
  constructor(private academicRepository: IAcademicRepository) { }

  async execute(input: GetRequirementsInfoRequestDTO): Promise<ResponseDTO<GetRequirementsInfoResponseDTO>> {
    const requirements = await this.academicRepository.findRequirementsByUserId(input.userId);
    if (!requirements) {
      return { data: { error: "Requirements information not found" }, success: false };
    }
    const response: GetRequirementsInfoResponseDTO = {
      core: requirements.core || { percentage: 0, completed: 0, total: 0 },
      elective: requirements.elective || { percentage: 0, completed: 0, total: 0 },
      general: requirements.general || { percentage: 0, completed: 0, total: 0 }
    };
    return { data: response, success: true };
  }
}

export class RegisterCourseUseCase implements IRegisterCourseUseCase {
  constructor(private academicRepository: IAcademicRepository) { }

  async execute(input: RegisterCourseRequestDTO): Promise<ResponseDTO<RegisterCourseResponseDTO>> {
    const course = await this.academicRepository.findCourseById(input.courseId);
    if (!course) {
      return { data: { error: "Course not found" }, success: false };
    }

    const existingEnrollment = await this.academicRepository.findEnrollment(input.studentId, input.courseId);
    if (existingEnrollment) {
      return {
        data: { error: "Already enrolled in this course" },
        success: false
      };
    }

    const enrollment = await this.academicRepository.createEnrollment({
      id: '',
      studentId: input.studentId,
      courseId: input.courseId,
      status: EnrollmentStatus.Pending,
      reason: input.reason,
      requestedAt: new Date().toISOString()
    });

    await this.academicRepository.updateCourseEnrollment(input.courseId, 1);

    const response: RegisterCourseResponseDTO = {
      success: true,
      message: "Course registered successfully",
      enrollmentId: enrollment._id?.toString() || ''
    };

    return { data: response, success: true };
  }
}

export class DropCourseUseCase implements IDropCourseUseCase {
  constructor(private academicRepository: IAcademicRepository) { }

  async execute(input: DropCourseRequestDTO): Promise<ResponseDTO<DropCourseResponseDTO>> {
    const enrollment = await this.academicRepository.findEnrollment(input.studentId, input.courseId);
    if (!enrollment) {
      return { data: { error: "Not enrolled in this course" }, success: false };
    }

    const success = await this.academicRepository.deleteEnrollment(input.studentId, input.courseId);
    if (!success) {
      return { data: { error: "Failed to drop course" }, success: false };
    }

    await this.academicRepository.updateCourseEnrollment(input.courseId, -1);

    const response: DropCourseResponseDTO = {
      success: true,
      message: "Course dropped successfully"
    };

    return { data: response, success: true };
  }
}

export class RequestTranscriptUseCase implements IRequestTranscriptUseCase {
  constructor(private academicRepository: IAcademicRepository) { }

  async execute(input: RequestTranscriptRequestDTO): Promise<ResponseDTO<RequestTranscriptResponseDTO>> {
    const request = await this.academicRepository.createTranscriptRequest({
      userId: input.studentId,
      deliveryMethod: input.deliveryMethod,
      requestedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      address: input.address,
      email: input.email
    });

    const response: RequestTranscriptResponseDTO = {
      success: true,
      message: "Transcript request submitted successfully",
      requestId: request._id?.toString() || '',
      estimatedDelivery: request.estimatedDelivery
    };

    return { data: response, success: true };
  }
}
