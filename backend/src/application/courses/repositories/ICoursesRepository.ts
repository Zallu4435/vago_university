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
  import {
    GetEnrollmentsRequestDTO,
    ApproveEnrollmentRequestDTO,
    RejectEnrollmentRequestDTO,
    GetCourseRequestDetailsRequestDTO,
    GetEnrollmentsResponseDTO,
    GetCourseRequestDetailsResponseDTO,
  } from "../../../domain/courses/dtos/EnrollmentRequestDTOs";
  
  export interface ICoursesRepository {
    getCourses(params: GetCoursesRequestDTO): Promise<GetCoursesResponseDTO>;
    getCourseById(params: GetCourseByIdRequestDTO): Promise<GetCourseByIdResponseDTO | null>;
    createCourse(params: CreateCourseRequestDTO): Promise<CreateCourseResponseDTO>;
    updateCourse(params: UpdateCourseRequestDTO): Promise<UpdateCourseResponseDTO | null>;
    deleteCourse(params: DeleteCourseRequestDTO): Promise<void>;
    getEnrollments(params: GetEnrollmentsRequestDTO): Promise<GetEnrollmentsResponseDTO>;
    approveEnrollment(params: ApproveEnrollmentRequestDTO): Promise<void>;
    rejectEnrollment(params: RejectEnrollmentRequestDTO): Promise<void>;
    getCourseRequestDetails(params: GetCourseRequestDetailsRequestDTO): Promise<GetCourseRequestDetailsResponseDTO | null>;
  }