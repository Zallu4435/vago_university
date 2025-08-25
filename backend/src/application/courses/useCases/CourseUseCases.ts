import {
  GetCoursesRequestDTO,
  GetCourseByIdRequestDTO,
  CreateCourseRequestDTO,
  UpdateCourseRequestDTO,
  DeleteCourseRequestDTO,
} from "../../../domain/courses/dtos/CourseRequestDTOs";
import {
  GetCoursesResponseDTO,
  GetCourseByIdResponseDTO,
  CreateCourseResponseDTO,
  UpdateCourseResponseDTO,
  CourseSummaryDTO,
} from "../../../domain/courses/dtos/CourseResponseDTOs";
import { ICoursesRepository } from "../repositories/ICoursesRepository";
import { Course } from "../../../domain/courses/entities/Course";
import { CourseNotFoundError, InvalidCourseIdError } from "../../../domain/courses/errors/CourseErrors";

export interface IGetCoursesUseCase {
  execute(params: GetCoursesRequestDTO): Promise<{ success: boolean; data: GetCoursesResponseDTO }>;
}

export interface IGetCourseByIdUseCase {
  execute(params: GetCourseByIdRequestDTO): Promise<{ success: boolean; data: GetCourseByIdResponseDTO }>; 
}

export interface ICreateCourseUseCase {
  execute(params: CreateCourseRequestDTO): Promise<{ success: boolean; data: CreateCourseResponseDTO }>;
}

export interface IUpdateCourseUseCase {
  execute(params: UpdateCourseRequestDTO): Promise<{ success: boolean; data: UpdateCourseResponseDTO }>; 
}

export interface IDeleteCourseUseCase {
  execute(params: DeleteCourseRequestDTO): Promise<{ success: boolean; data: void }>;
}
 
export class GetCoursesUseCase implements IGetCoursesUseCase {
  constructor(private readonly _courseRepository: ICoursesRepository) {}

  async execute(params: GetCoursesRequestDTO): Promise<{ success: boolean; data: GetCoursesResponseDTO }> {
    const { courses, totalItems, page, limit } = await this._courseRepository.getCourses(params);
    const mappedCourses: CourseSummaryDTO[] = courses.map((course) => ({
      id: course._id.toString(),
      title: course.title,
      specialization: course.specialization,
      faculty: course.faculty,
      term: course.term || "",
      credits: course.credits,
      currentEnrollment: course.currentEnrollment || 0,
      maxEnrollment: course.maxEnrollment || 0,
    }));
    return {
      success: true,
      data: {
        data: mappedCourses,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }
}

export class GetCourseByIdUseCase implements IGetCourseByIdUseCase {
  constructor(private readonly _courseRepository: ICoursesRepository) {}

  async execute(params: GetCourseByIdRequestDTO): Promise<{ success: boolean; data: GetCourseByIdResponseDTO }> {
    if (!params.id) {
      throw new InvalidCourseIdError();
    }
    const course = await this._courseRepository.getCourseById(params.id);
    if (!course) {
      throw new CourseNotFoundError(params.id);
    }
    return {
      success: true,
      data: {
        course: {
          id: course._id.toString(),
          title: course.title,
          specialization: course.specialization,
          faculty: course.faculty,
          credits: course.credits,
          schedule: course.schedule,
          maxEnrollment: course.maxEnrollment,
          currentEnrollment: course.currentEnrollment,
          description: course.description,
          term: course.term,
          prerequisites: course.prerequisites,
        },
      },
    };
  }
}

export class CreateCourseUseCase implements ICreateCourseUseCase {
  constructor(private readonly _courseRepository: ICoursesRepository) {}

  async execute(params: CreateCourseRequestDTO): Promise<{ success: boolean; data: CreateCourseResponseDTO }> {
    const newCourse = await this._courseRepository.createCourse(params);
    return {
      success: true,
      data: {
        course: new Course({
          id: newCourse._id.toString(),
          title: newCourse.title,
          specialization: newCourse.specialization,
          faculty: newCourse.faculty,
          credits: newCourse.credits,
          schedule: newCourse.schedule,
          maxEnrollment: newCourse.maxEnrollment,
          currentEnrollment: newCourse.currentEnrollment,
          description: newCourse.description,
          term: newCourse.term,
          prerequisites: newCourse.prerequisites,
        }),
      },
    };
  }
}

export class UpdateCourseUseCase implements IUpdateCourseUseCase {
  constructor(private readonly _courseRepository: ICoursesRepository) {}

  async execute(params: UpdateCourseRequestDTO): Promise<{ success: boolean; data: UpdateCourseResponseDTO }> {
    if (!params.id) {
      throw new InvalidCourseIdError();
    }
    const updatedCourse = await this._courseRepository.updateCourse(params);
    if (!updatedCourse) {
      throw new CourseNotFoundError(params.id);
    }
    return {
      success: true,
      data: {
        course: new Course({
          id: updatedCourse._id.toString(),
          title: updatedCourse.title,
          specialization: updatedCourse.specialization,
          faculty: updatedCourse.faculty,
          credits: updatedCourse.credits,
          schedule: updatedCourse.schedule,
          maxEnrollment: updatedCourse.maxEnrollment,
          currentEnrollment: updatedCourse.currentEnrollment,
          description: updatedCourse.description,
          term: updatedCourse.term,
          prerequisites: updatedCourse.prerequisites,
        }),
      },
    };
  }
}

export class DeleteCourseUseCase implements IDeleteCourseUseCase {
  constructor(private readonly _courseRepository: ICoursesRepository) {}

  async execute(params: DeleteCourseRequestDTO): Promise<{ success: boolean; data: void }> {
    if (!params.id) {
      throw new InvalidCourseIdError();
    }
    await this._courseRepository.deleteCourse(params);
    return { success: true, data: undefined };
  }
}