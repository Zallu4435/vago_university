import { ICourseEnrollmentController } from "../../../presentation/http/IHttp";
import { EnrollmentController } from "../../../presentation/http/courses/EnrollmentController";
import { GetEnrollmentsUseCase, ApproveEnrollmentUseCase, RejectEnrollmentUseCase, GetCourseRequestDetailsUseCase } from "../../../application/courses/useCases/EnrollmentUseCases";
import { CoursesRepository } from "../../repositories/courses/CourseRepository";

export function getCourseEnrollmentsComposer(): ICourseEnrollmentController {
  const repository = new CoursesRepository();
  const getEnrollmentsUseCase = new GetEnrollmentsUseCase(repository);
  const approveEnrollmentUseCase = new ApproveEnrollmentUseCase(repository);
  const rejectEnrollmentUseCase = new RejectEnrollmentUseCase(repository);
  const getCourseRequestDetailsUseCase = new GetCourseRequestDetailsUseCase(repository);

  return new EnrollmentController(
    getEnrollmentsUseCase,
    approveEnrollmentUseCase,
    rejectEnrollmentUseCase,
    getCourseRequestDetailsUseCase
  );
} 