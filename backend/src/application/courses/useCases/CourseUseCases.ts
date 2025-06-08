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
} from "../../../domain/courses/dtos/CourseResponseDTOs";
import { ICoursesRepository } from "../repositories/ICoursesRepository";

export interface IGetCoursesUseCase {
  execute(params: GetCoursesRequestDTO): Promise<{ success: boolean; data: GetCoursesResponseDTO }>;
}

export interface IGetCourseByIdUseCase {
  execute(params: GetCourseByIdRequestDTO): Promise<{ success: boolean; data: GetCourseByIdResponseDTO | null }>;
}

export interface ICreateCourseUseCase {
  execute(params: CreateCourseRequestDTO): Promise<{ success: boolean; data: CreateCourseResponseDTO }>;
}

export interface IUpdateCourseUseCase {
  execute(params: UpdateCourseRequestDTO): Promise<{ success: boolean; data: UpdateCourseResponseDTO | null }>;
}

export interface IDeleteCourseUseCase {
  execute(params: DeleteCourseRequestDTO): Promise<{ success: boolean; data: void }>;
}

export class GetCoursesUseCase implements IGetCoursesUseCase {
  constructor(private readonly courseRepository: ICoursesRepository) {}

  async execute(params: GetCoursesRequestDTO): Promise<{ success: boolean; data: GetCoursesResponseDTO }> {
    try {
      const data = await this.courseRepository.getCourses(params);
      return { success: true, data };
    } catch (error) {
      return { success: false, data: null as any };
    }
  }
}

export class GetCourseByIdUseCase implements IGetCourseByIdUseCase {
  constructor(private readonly courseRepository: ICoursesRepository) {}

  async execute(params: GetCourseByIdRequestDTO): Promise<{ success: boolean; data: GetCourseByIdResponseDTO | null }> {
    try {
      const data = await this.courseRepository.getCourseById(params);
      return { success: true, data };
    } catch (error) {
      return { success: false, data: null };
    }
  }
}

export class CreateCourseUseCase implements ICreateCourseUseCase {
  constructor(private readonly courseRepository: ICoursesRepository) {}

  async execute(params: CreateCourseRequestDTO): Promise<{ success: boolean; data: CreateCourseResponseDTO }> {
    try {
      const data = await this.courseRepository.createCourse(params);
      return { success: true, data };
    } catch (error) {
      return { success: false, data: null as any };
    }
  }
}

export class UpdateCourseUseCase implements IUpdateCourseUseCase {
  constructor(private readonly courseRepository: ICoursesRepository) {}

  async execute(params: UpdateCourseRequestDTO): Promise<{ success: boolean; data: UpdateCourseResponseDTO | null }> {
    try {
      const data = await this.courseRepository.updateCourse(params);
      return { success: true, data };
    } catch (error) {
      return { success: false, data: null };
    }
  }
}

export class DeleteCourseUseCase implements IDeleteCourseUseCase {
  constructor(private readonly courseRepository: ICoursesRepository) {}

  async execute(params: DeleteCourseRequestDTO): Promise<{ success: boolean; data: void }> {
    try {
      await this.courseRepository.deleteCourse(params);
      return { success: true, data: undefined };
    } catch (error) {
      return { success: false, data: undefined };
    }
  }
}