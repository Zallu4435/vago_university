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
    ScheduleMeetingRequestDTO,
    ScheduleMeetingResponseDTO,
  } from "../../../domain/academics/dtos/AcademicDTOs";
import { IAcademicRepository } from "../repositories/IAcademicRepository";
import mongoose from "mongoose";
import { EnrollmentStatus } from "../../../domain/academics/entities/Academic";

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
  
  export interface IScheduleMeetingUseCase {
  execute(input: ScheduleMeetingRequestDTO): Promise<ResponseDTO<ScheduleMeetingResponseDTO>>;
}

export class GetStudentInfoUseCase implements IGetStudentInfoUseCase {
  constructor(private academicRepository: IAcademicRepository) {}

  async execute(input: GetStudentInfoRequestDTO): Promise<ResponseDTO<GetStudentInfoResponseDTO>> {
    try {
      const student = await this.academicRepository.findStudentById(input.userId);
      if (!student) {
        return { data: { error: "Student not found" }, success: false };
      }
      
      const response: GetStudentInfoResponseDTO = {
        name: `${student.firstName} ${student.lastName}`,
        id: student.id,
        email: student.email,
        phone: student.phone,
        profilePicture: student.profilePicture,
        major: student.major,
        catalogYear: student.catalogYear,
        academicStanding: student.academicStanding,
        advisor: student.advisor,
        pendingCredits: student.pendingCredits,
        credits: student.credits
      };
      
      return { data: response, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetGradeInfoUseCase implements IGetGradeInfoUseCase {
  constructor(private academicRepository: IAcademicRepository) {}

  async execute(input: GetGradeInfoRequestDTO): Promise<ResponseDTO<GetGradeInfoResponseDTO>> {
    try {
      const grade = await this.academicRepository.findGradeByUserId(input.userId);
      if (!grade) {
        return { data: { error: "Grade information not found" }, success: false };
      }
      
      const response: GetGradeInfoResponseDTO = {
        cumulativeGPA: grade.cumulativeGPA,
        termGPA: grade.termGPA,
        termName: grade.termName,
        creditsEarned: grade.creditsEarned,
        creditsInProgress: grade.creditsInProgress
      };
      
      return { data: response, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetCoursesUseCase implements IGetCoursesUseCase {
  constructor(private academicRepository: IAcademicRepository) {}

  async execute(input: GetCoursesRequestDTO): Promise<ResponseDTO<GetCoursesResponseDTO>> {
    try {
      const courses = await this.academicRepository.findAllCourses();
      
      const response: GetCoursesResponseDTO = {
        courses: courses,
        totalCourses: courses.length,
        totalPages: 1, // Assuming single page for now
        currentPage: 1
      };
      
      return { data: response, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetAcademicHistoryUseCase implements IGetAcademicHistoryUseCase {
  constructor(private academicRepository: IAcademicRepository) {}

  async execute(input: GetAcademicHistoryRequestDTO): Promise<ResponseDTO<GetAcademicHistoryResponseDTO>> {
    try {
      const history = await this.academicRepository.findAcademicHistory(input.userId, input.startTerm, input.endTerm);
      
      const response: GetAcademicHistoryResponseDTO = {
        history: history.map(item => ({
          term: item.term,
          credits: item.credits,
          gpa: item.gpa,
          id: item.id
        }))
      };
      
      return { data: response, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetProgramInfoUseCase implements IGetProgramInfoUseCase {
  constructor(private academicRepository: IAcademicRepository) {}

  async execute(input: GetProgramInfoRequestDTO): Promise<ResponseDTO<GetProgramInfoResponseDTO>> {
    try {
      const program = await this.academicRepository.findProgramByUserId(input.userId);
      if (!program) {
        return { data: { error: "Program information not found" }, success: false };
      }
      
      const response: GetProgramInfoResponseDTO = {
        degree: program.degree,
        catalogYear: program.catalogYear
      };
      
      return { data: response, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetProgressInfoUseCase implements IGetProgressInfoUseCase {
  constructor(private academicRepository: IAcademicRepository) {}

  async execute(input: GetProgressInfoRequestDTO): Promise<ResponseDTO<GetProgressInfoResponseDTO>> {
    try {
      const progress = await this.academicRepository.findProgressByUserId(input.userId);
      if (!progress) {
        return { data: { error: "Progress information not found" }, success: false };
      }
      
      const response: GetProgressInfoResponseDTO = {
        overallProgress: progress.overallProgress,
        totalCredits: progress.totalCredits,
        completedCredits: progress.completedCredits,
        remainingCredits: progress.remainingCredits,
        estimatedGraduation: progress.estimatedGraduation
      };
      
      return { data: response, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetRequirementsInfoUseCase implements IGetRequirementsInfoUseCase {
  constructor(private academicRepository: IAcademicRepository) {}

  async execute(input: GetRequirementsInfoRequestDTO): Promise<ResponseDTO<GetRequirementsInfoResponseDTO>> {
    try {
      const requirements = await this.academicRepository.findRequirementsByUserId(input.userId);
      if (!requirements) {
        return { data: { error: "Requirements information not found" }, success: false };
      }
      
      const response: GetRequirementsInfoResponseDTO = {
        core: requirements.core,
        elective: requirements.elective,
        general: requirements.general
      };
      
      return { data: response, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class RegisterCourseUseCase implements IRegisterCourseUseCase {
  constructor(private academicRepository: IAcademicRepository) {}

  async execute(input: RegisterCourseRequestDTO): Promise<ResponseDTO<RegisterCourseResponseDTO>> {
    try {
      const course = await this.academicRepository.findCourseById(input.courseId);
      if (!course) {
        return { data: { error: "Course not found" }, success: false };
      }

      const existingEnrollment = await this.academicRepository.findEnrollment(input.studentId, input.courseId);
      if (existingEnrollment) {
        return { data: { error: "Already enrolled in this course" }, success: false };
      }

      const enrollment = await this.academicRepository.createEnrollment({
        id: new mongoose.Types.ObjectId().toString(),
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
        enrollmentId: enrollment.id
      };
      
      return { data: response, success: true };
    } catch (error: any) {
      console.error('RegisterCourseUseCase - Error:', error);
      return { data: { error: error.message }, success: false };
    }
  }
}

export class DropCourseUseCase implements IDropCourseUseCase {
  constructor(private academicRepository: IAcademicRepository) {}

  async execute(input: DropCourseRequestDTO): Promise<ResponseDTO<DropCourseResponseDTO>> {
    try {
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
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class RequestTranscriptUseCase implements IRequestTranscriptUseCase {
  constructor(private academicRepository: IAcademicRepository) {}

  async execute(input: RequestTranscriptRequestDTO): Promise<ResponseDTO<RequestTranscriptResponseDTO>> {
    try {
      const request = await this.academicRepository.createTranscriptRequest({
        id: new mongoose.Types.ObjectId().toString(),
        userId: input.studentId,
        deliveryMethod: input.deliveryMethod,
        requestedAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        address: input.address,
        email: input.email
      });
      
      const response: RequestTranscriptResponseDTO = {
        success: true,
        message: "Transcript request submitted successfully",
        requestId: request.id,
        estimatedDelivery: request.estimatedDelivery
      };
      
      return { data: response, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class ScheduleMeetingUseCase implements IScheduleMeetingUseCase {
  constructor(private academicRepository: IAcademicRepository) {}

  async execute(input: ScheduleMeetingRequestDTO): Promise<ResponseDTO<ScheduleMeetingResponseDTO>> {
    try {
      const meeting = await this.academicRepository.createMeeting({
        id: new mongoose.Types.ObjectId().toString(),
        userId: input.studentId,
        date: input.date,
        reason: input.reason,
        preferredTime: input.preferredTime,
        notes: input.notes,
        meetingTime: input.date, // Using date as meeting time for now
        location: "Academic Advisor Office", // Default location
        createdAt: new Date().toISOString()
      });
      
      const response: ScheduleMeetingResponseDTO = {
        success: true,
        message: "Meeting scheduled successfully",
        meetingId: meeting.id,
        meetingTime: meeting.meetingTime,
        location: meeting.location
      };
      
      return { data: response, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}