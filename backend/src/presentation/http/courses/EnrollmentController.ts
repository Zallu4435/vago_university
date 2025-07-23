import { IHttpRequest, IHttpResponse, ICourseEnrollmentController, HttpSuccess, HttpErrors } from "../IHttp";
import { IGetEnrollmentsUseCase, IApproveEnrollmentUseCase, IRejectEnrollmentUseCase, IGetCourseRequestDetailsUseCase } from "../../../application/courses/useCases/EnrollmentUseCases";
import { GetEnrollmentsRequestDTO, ApproveEnrollmentRequestDTO, RejectEnrollmentRequestDTO, GetCourseRequestDetailsRequestDTO } from "../../../domain/courses/dtos/EnrollmentRequestDTOs";
import { DomainError } from "../../../domain/courses/errors/CourseErrors";

export class EnrollmentController implements ICourseEnrollmentController {
  private httpSuccess = new HttpSuccess();
  private httpErrors = new HttpErrors();

  constructor(
    private readonly getEnrollmentsUseCase: IGetEnrollmentsUseCase,
    private readonly approveEnrollmentUseCase: IApproveEnrollmentUseCase,
    private readonly rejectEnrollmentUseCase: IRejectEnrollmentUseCase,
    private readonly getCourseRequestDetailsUseCase: IGetCourseRequestDetailsUseCase
  ) {}

  async getEnrollments(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { page = 1, limit = 10, status } = httpRequest.query;
    const params: GetEnrollmentsRequestDTO = {
      page: Number(page),
      limit: Number(limit),
      status: status as string,
    };
    const result = await this.getEnrollmentsUseCase.execute(params);
    if (!result.success) {
      return this.httpErrors.error_400("Failed to get enrollments");
    }
    return this.httpSuccess.success_200(result.data);
  }

  async getEnrollmentDetails(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    const params: GetCourseRequestDetailsRequestDTO = { id };
    const result = await this.getCourseRequestDetailsUseCase.execute(params);
    if (!result.success) {
      return this.httpErrors.error_400("Failed to get enrollment details");
    }
    if (!result.data) {
      return this.httpErrors.error_404("Enrollment not found");
    }
    console.log(result.data, "result.data");
    return this.httpSuccess.success_200(result.data);
  }

  async approveEnrollment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    const params: ApproveEnrollmentRequestDTO = { enrollmentId: id };
    const result = await this.approveEnrollmentUseCase.execute(params);
    if (!result.success) {
      return this.httpErrors.error_400("Failed to approve enrollment");
    }
    return this.httpSuccess.success_200({ message: "Enrollment approved successfully" });
  }

  async rejectEnrollment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    const params: RejectEnrollmentRequestDTO = { enrollmentId: id };
    const result = await this.rejectEnrollmentUseCase.execute(params);
    if (!result.success) {
      return this.httpErrors.error_400("Failed to reject enrollment");
    }
    return this.httpSuccess.success_200({ message: "Enrollment rejected successfully" });
  }
} 