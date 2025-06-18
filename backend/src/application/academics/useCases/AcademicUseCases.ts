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
      const result = await this.academicRepository.findStudentById(input.userId);
      if (!result) {
        return { data: { error: "Student not found" }, success: false };
      }
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetGradeInfoUseCase implements IGetGradeInfoUseCase {
  constructor(private academicRepository: IAcademicRepository) {}

  async execute(input: GetGradeInfoRequestDTO): Promise<ResponseDTO<GetGradeInfoResponseDTO>> {
    try {
      const result = await this.academicRepository.findGradeByUserId(input.userId);
      if (!result) {
        return { data: { error: "Grade information not found" }, success: false };
      }
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetCoursesUseCase implements IGetCoursesUseCase {
  constructor(private academicRepository: IAcademicRepository) {}

  async execute(input: GetCoursesRequestDTO): Promise<ResponseDTO<GetCoursesResponseDTO>> {
    try {
      const result = await this.academicRepository.findAllCourses();
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetAcademicHistoryUseCase implements IGetAcademicHistoryUseCase {
  constructor(private academicRepository: IAcademicRepository) {}

  async execute(input: GetAcademicHistoryRequestDTO): Promise<ResponseDTO<GetAcademicHistoryResponseDTO>> {
    try {
      const result = await this.academicRepository.findAcademicHistory(input.userId, input.startTerm, input.endTerm);
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetProgramInfoUseCase implements IGetProgramInfoUseCase {
  constructor(private academicRepository: IAcademicRepository) {}

  async execute(input: GetProgramInfoRequestDTO): Promise<ResponseDTO<GetProgramInfoResponseDTO>> {
    try {
      const result = await this.academicRepository.findProgramByUserId(input.userId);
      if (!result) {
        return { data: { error: "Program information not found" }, success: false };
      }
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetProgressInfoUseCase implements IGetProgressInfoUseCase {
  constructor(private academicRepository: IAcademicRepository) {}

  async execute(input: GetProgressInfoRequestDTO): Promise<ResponseDTO<GetProgressInfoResponseDTO>> {
    try {
      const result = await this.academicRepository.findProgressByUserId(input.userId);
      if (!result) {
        return { data: { error: "Progress information not found" }, success: false };
      }
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetRequirementsInfoUseCase implements IGetRequirementsInfoUseCase {
  constructor(private academicRepository: IAcademicRepository) {}

  async execute(input: GetRequirementsInfoRequestDTO): Promise<ResponseDTO<GetRequirementsInfoResponseDTO>> {
    try {
      const result = await this.academicRepository.findRequirementsByUserId(input.userId);
      if (!result) {
        return { data: { error: "Requirements information not found" }, success: false };
      }
      return { data: result, success: true };
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
      return { 
        data: {
          success: true,
          message: "Course registered successfully",
          enrollmentId: enrollment.id
        }, 
        success: true 
      };
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
      const enrollment = await this.academicRepository.findEnrollment(input.userId, input.courseId);
      if (!enrollment) {
        return { data: { error: "Not enrolled in this course" }, success: false };
      }

      const success = await this.academicRepository.deleteEnrollment(input.userId, input.courseId);
      if (!success) {
        return { data: { error: "Failed to drop course" }, success: false };
      }

      await this.academicRepository.updateCourseEnrollment(input.courseId, -1);
      return { data: { message: "Course dropped successfully" }, success: true };
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
        studentId: input.userId,
        requestDate: new Date(),
        status: "pending",
        purpose: input.purpose,
        deliveryMethod: input.deliveryMethod,
      });
      return { data: request, success: true };
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
        studentId: input.userId,
        advisorId: input.advisorId,
        date: input.date,
        purpose: input.purpose,
        status: "scheduled",
        notes: input.notes,
      });
      return { data: meeting, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
  }