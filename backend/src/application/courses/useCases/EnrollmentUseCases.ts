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
import { EnrollmentStatus } from "../../../domain/courses/entities/coursetypes";
import { PopulatedEnrollment } from "../../../domain/courses/entities/EnrollmentResponseEntities";
import {
  IGetEnrollmentsUseCase,
  IApproveEnrollmentUseCase,
  IRejectEnrollmentUseCase,
  IGetCourseRequestDetailsUseCase
} from "./IEnrollmentUseCases";


export class GetEnrollmentsUseCase implements IGetEnrollmentsUseCase {
  constructor(private readonly _courseRepository: ICoursesRepository) {}

  async execute(params: GetEnrollmentsRequestDTO): Promise<{ success: boolean; data: GetEnrollmentsResponseDTO }> {
    const { enrollments, totalItems, page, limit } = await this._courseRepository.getEnrollments(params);
    const mappedEnrollments: SimplifiedEnrollmentDTO[] = enrollments.map((enrollment: PopulatedEnrollment) => ({
      id: enrollment._id.toString(),
      studentName: enrollment.studentId?.email || "Unknown",
      studentId: enrollment.studentId?._id?.toString() || "",
      courseId: enrollment.courseId?._id?.toString() || "",
      courseTitle: enrollment.courseId?.title || "Unknown Course",
      requestedAt: new Date(enrollment.requestedAt),
      status: enrollment.status as EnrollmentStatus,
      specialization: enrollment.courseId?.specialization || "N/A",
      faculty: enrollment.courseId?.faculty || "N/A",
      term: enrollment.courseId?.term || "N/A",
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
  constructor(private readonly _courseRepository: ICoursesRepository) {}

  async execute(params: ApproveEnrollmentRequestDTO): Promise<{ success: boolean; data: void }> {
    await this._courseRepository.approveEnrollment(params);
    return { success: true, data: undefined };
  }
}

export class RejectEnrollmentUseCase implements IRejectEnrollmentUseCase {
  constructor(private readonly _courseRepository: ICoursesRepository) {}

  async execute(params: RejectEnrollmentRequestDTO): Promise<{ success: boolean; data: void }> {
    await this._courseRepository.rejectEnrollment(params);
    return { success: true, data: undefined };
  }
}

export class GetCourseRequestDetailsUseCase implements IGetCourseRequestDetailsUseCase {
  constructor(private readonly _courseRepository: ICoursesRepository) {}

  async execute(params: GetCourseRequestDetailsRequestDTO): Promise<{ success: boolean; data: GetCourseRequestDetailsResponseDTO | null }> {
    if (!params.id) {
      throw new InvalidEnrollmentIdError();
    }
    const enrollment: PopulatedEnrollment = await this._courseRepository.getCourseRequestDetails(params);
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
            id: enrollment.courseId._id.toString(),
            title: enrollment.courseId.title,
            specialization: enrollment.courseId.specialization,
            term: enrollment.courseId.term || "",
            faculty: enrollment.courseId.faculty,
            credits: enrollment.courseId.credits,
          },
          user: enrollment.studentId
            ? {
                id: enrollment.studentId._id.toString(),
                name: `${enrollment.studentId.firstName} ${enrollment.studentId.lastName || ''}`.trim(),
                email: enrollment.studentId.email,
              }
            : undefined,
        },
      },
    };
  }
} 