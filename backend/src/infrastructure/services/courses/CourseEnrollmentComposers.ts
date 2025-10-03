import { ICourseEnrollmentController } from "../../../presentation/http/IHttp";
import { EnrollmentController } from "../../../presentation/http/courses/EnrollmentController";
import { GetEnrollmentsUseCase, ApproveEnrollmentUseCase, RejectEnrollmentUseCase, GetCourseRequestDetailsUseCase } from "../../../application/courses/useCases/EnrollmentUseCases";
import { IApproveEnrollmentUseCase, IRejectEnrollmentUseCase, IGetCourseRequestDetailsUseCase, IGetEnrollmentsUseCase } from "../../../application/courses/useCases/IEnrollmentUseCases";
import { CoursesRepository } from "../../repositories/courses/CourseRepository";

export function getCourseEnrollmentsComposer(): ICourseEnrollmentController {
  const repository = new CoursesRepository();
  const getEnrollmentsUseCase: IGetEnrollmentsUseCase = new GetEnrollmentsUseCase(repository);
  const approveEnrollmentUseCase: IApproveEnrollmentUseCase = new ApproveEnrollmentUseCase(repository);
  const rejectEnrollmentUseCase: IRejectEnrollmentUseCase = new RejectEnrollmentUseCase(repository);
  const getCourseRequestDetailsUseCase: IGetCourseRequestDetailsUseCase = new GetCourseRequestDetailsUseCase(repository);

  return new EnrollmentController(
    getEnrollmentsUseCase,
    approveEnrollmentUseCase,
    rejectEnrollmentUseCase,
    getCourseRequestDetailsUseCase
  );
} 