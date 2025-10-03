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
