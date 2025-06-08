import { Course } from "../entities/Course";

interface PaginatedResponseDTO<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface CourseSummaryDTO {
  id: string;
  title: string;
  specialization: string;
  faculty: string;
  term: string;
  credits: number;
}

export interface GetCoursesResponseDTO extends PaginatedResponseDTO<CourseSummaryDTO> {
  data: CourseSummaryDTO[];
}

export interface GetCourseByIdResponseDTO {
  course: Course;
}

export interface CreateCourseResponseDTO {
  course: Course;
}

export interface UpdateCourseResponseDTO {
  course: Course;
}