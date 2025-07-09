import {
  GetEnrollmentsRequestDTO,
  ApproveEnrollmentRequestDTO,
  RejectEnrollmentRequestDTO,
  GetCourseRequestDetailsRequestDTO,
  GetEnrollmentsResponseDTO,
  GetCourseRequestDetailsResponseDTO,
  SimplifiedEnrollmentDTO,
} from "../../../domain/courses/dtos/EnrollmentRequestDTOs";
import { ICoursesRepository } from "../repositories/ICoursesRepository";
import {
  CourseNotFoundError,
  EnrollmentNotFoundError,
  InvalidEnrollmentIdError,
} from "../../../domain/courses/errors/CourseErrors";

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
    const { enrollments, totalItems, page, limit }: any = await this.courseRepository.getEnrollments(params);
    const mappedEnrollments: SimplifiedEnrollmentDTO[] = enrollments.map((enrollment: any) => ({
      id: enrollment._id.toString(),
      studentName: (enrollment.studentId as any)?.email || "Unknown",
      studentId: (enrollment.studentId as any)?._id?.toString() || "",
      courseTitle: (enrollment.courseId as any)?.title || "Unknown Course",
      requestedAt: enrollment.requestedAt?.toISOString() || "",
      status: enrollment.status,
      specialization: (enrollment.courseId as any)?.specialization || "N/A",
      term: (enrollment.courseId as any)?.term || "N/A",
    }));
    return {
      success: true,
      data: {
        data: mappedEnrollments,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }
}

export class ApproveEnrollmentUseCase implements IApproveEnrollmentUseCase {
  constructor(private readonly courseRepository: ICoursesRepository) {}

  async execute(params: ApproveEnrollmentRequestDTO): Promise<{ success: boolean; data: void }> {
    const enrollment: any = await this.courseRepository.approveEnrollment(params);
    if (!enrollment) {
      throw new EnrollmentNotFoundError(params.enrollmentId);
    }
    // Additional business logic for approval can be added here
    return { success: true, data: undefined };
  }
}

export class RejectEnrollmentUseCase implements IRejectEnrollmentUseCase {
  constructor(private readonly courseRepository: ICoursesRepository) {}

  async execute(params: RejectEnrollmentRequestDTO): Promise<{ success: boolean; data: void }> {
    const enrollment: any = await this.courseRepository.rejectEnrollment(params);
    if (!enrollment) {
      throw new EnrollmentNotFoundError(params.enrollmentId);
    }
    // Additional business logic for rejection can be added here
    return { success: true, data: undefined };
  }
}

export class GetCourseRequestDetailsUseCase implements IGetCourseRequestDetailsUseCase {
  constructor(private readonly courseRepository: ICoursesRepository) {}

  async execute(params: GetCourseRequestDetailsRequestDTO): Promise<{ success: boolean; data: GetCourseRequestDetailsResponseDTO | null }> {
    if (!params.id) {
      throw new InvalidEnrollmentIdError();
    }
    const enrollment: any = await this.courseRepository.getCourseRequestDetails(params);
    if (!enrollment) {
      throw new EnrollmentNotFoundError(params.id);
    }
    if (!enrollment.courseId) {
      throw new CourseNotFoundError();
    }
    return {
      success: true,
      data: {
        courseRequest: {
          id: enrollment._id.toString(),
          status: enrollment.status,
          createdAt: enrollment.requestedAt.toISOString(),
          updatedAt: enrollment.updatedAt?.toISOString() || new Date().toISOString(),
          reason: enrollment.reason || "No reason provided",
          course: {
            id: (enrollment.courseId as any)._id.toString(),
            title: (enrollment.courseId as any).title,
            specialization: (enrollment.courseId as any).specialization,
            term: (enrollment.courseId as any).term || "",
            faculty: (enrollment.courseId as any).faculty,
            credits: (enrollment.courseId as any).credits,
          },
          user: enrollment.studentId
            ? {
                id: (enrollment.studentId as any)._id.toString(),
                name: `${(enrollment.studentId as any).firstName} ${(enrollment.studentId as any).lastName || ''}`.trim(),
                email: (enrollment.studentId as any).email,
              }
            : undefined,
        },
      },
    };
  }
} 