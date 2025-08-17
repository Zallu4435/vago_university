import {
    GetCoursesRequest,
    CreateCourseRequest,
    UpdateCourseRequest,
    DeleteCourseRequest,
  } from "../../../domain/courses/entities/CourseRequestEntities";
  import {
    GetCoursesResponse,
    GetCourseByIdResponse,
    CreateCourseResponse,
    UpdateCourseResponse,
  } from "../../../domain/courses/entities/CourseResponseEntities";
  import {
    GetEnrollmentsRequest,
    ApproveEnrollmentRequest,
    RejectEnrollmentRequest,
    GetCourseRequestDetailsRequest,
  } from "../../../domain/courses/entities/EnrollmentRequestEntities";
  import {
    GetEnrollmentsResponse,
    GetCourseRequestDetailsResponse,
  } from "../../../domain/courses/entities/EnrollmentResponseEntities";
import { IBaseRepository } from "../../repositories";
import { ICourseDocument } from "../../../domain/courses/entities/coursetypes";
   
export interface ICoursesRepository extends IBaseRepository<ICourseDocument, CreateCourseRequest, UpdateCourseRequest, Record<string, unknown>, ICourseDocument> {
  getCourses(params: GetCoursesRequest): Promise<GetCoursesResponse>;
  getCourseById(id: string): Promise<GetCourseByIdResponse>;
  createCourse(params: CreateCourseRequest): Promise<CreateCourseResponse>;
  updateCourse(params: UpdateCourseRequest): Promise<UpdateCourseResponse>;
  deleteCourse(params: DeleteCourseRequest): Promise<void>;
  getEnrollments(params: GetEnrollmentsRequest): Promise<GetEnrollmentsResponse>;
  approveEnrollment(params: ApproveEnrollmentRequest): Promise<void>;
  rejectEnrollment(params: RejectEnrollmentRequest): Promise<void>;
  getCourseRequestDetails(params: GetCourseRequestDetailsRequest): Promise<GetCourseRequestDetailsResponse>;
}