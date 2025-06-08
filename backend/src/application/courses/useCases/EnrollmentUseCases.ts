import {
  GetEnrollmentsRequestDTO,
  ApproveEnrollmentRequestDTO,
  RejectEnrollmentRequestDTO,
  GetCourseRequestDetailsRequestDTO,
  GetEnrollmentsResponseDTO,
  GetCourseRequestDetailsResponseDTO,
} from "../../../domain/courses/dtos/EnrollmentRequestDTOs";
import { ICoursesRepository } from "../repositories/ICoursesRepository";

export interface IGetEnrollmentsUseCase {
  execute(params: GetEnrollmentsRequestDTO): Promise<{ success: boolean; data: GetEnrollmentsResponseDTO }>;
}

export interface IApproveEnrollmentUseCase {
  execute(params: ApproveEnrollmentRequestDTO): Promise<{ success: boolean; data: void }>;
}

export interface IRejectEnrollmentUseCase {
  execute(params: RejectEnrollmentRequestDTO): Promise<{ success: boolean; data: void }>;
}

export interface IGetCourseRequestDetailsUseCase {
  execute(params: GetCourseRequestDetailsRequestDTO): Promise<{ success: boolean; data: GetCourseRequestDetailsResponseDTO | null }>;
}

export class GetEnrollmentsUseCase implements IGetEnrollmentsUseCase {
  constructor(private readonly courseRepository: ICoursesRepository) {}

  async execute(params: GetEnrollmentsRequestDTO): Promise<{ success: boolean; data: GetEnrollmentsResponseDTO }> {
    try {
      const data = await this.courseRepository.getEnrollments(params);
      return { success: true, data };
    } catch (error) {
      return { success: false, data: null as any };
    }
  }
}

export class ApproveEnrollmentUseCase implements IApproveEnrollmentUseCase {
  constructor(private readonly courseRepository: ICoursesRepository) {}

  async execute(params: ApproveEnrollmentRequestDTO): Promise<{ success: boolean; data: void }> {
    try {
      await this.courseRepository.approveEnrollment(params);
      return { success: true, data: undefined };
    } catch (error) {
      return { success: false, data: undefined };
    }
  }
}

export class RejectEnrollmentUseCase implements IRejectEnrollmentUseCase {
  constructor(private readonly courseRepository: ICoursesRepository) {}

  async execute(params: RejectEnrollmentRequestDTO): Promise<{ success: boolean; data: void }> {
    try {
      await this.courseRepository.rejectEnrollment(params);
      return { success: true, data: undefined };
    } catch (error) {
      return { success: false, data: undefined };
    }
  }
}

export class GetCourseRequestDetailsUseCase implements IGetCourseRequestDetailsUseCase {
  constructor(private readonly courseRepository: ICoursesRepository) {}

  async execute(params: GetCourseRequestDetailsRequestDTO): Promise<{ success: boolean; data: GetCourseRequestDetailsResponseDTO | null }> {
    try {
      const data = await this.courseRepository.getCourseRequestDetails(params);
      return { success: true, data };
    } catch (error) {
      return { success: false, data: null };
    }
  }
} 