import { IHttpRequest, IHttpResponse, ICourseEnrollmentController } from "../../IHttp";
import { IGetEnrollmentsUseCase, IApproveEnrollmentUseCase, IRejectEnrollmentUseCase, IGetCourseRequestDetailsUseCase } from "../../../application/courses/useCases/EnrollmentUseCases";
import { GetEnrollmentsRequestDTO, ApproveEnrollmentRequestDTO, RejectEnrollmentRequestDTO, GetCourseRequestDetailsRequestDTO } from "../../../domain/courses/dtos/EnrollmentRequestDTOs";

export class EnrollmentController implements ICourseEnrollmentController {
  constructor(
    private readonly getEnrollmentsUseCase: IGetEnrollmentsUseCase,
    private readonly approveEnrollmentUseCase: IApproveEnrollmentUseCase,
    private readonly rejectEnrollmentUseCase: IRejectEnrollmentUseCase,
    private readonly getCourseRequestDetailsUseCase: IGetCourseRequestDetailsUseCase
  ) {}

  async getEnrollments(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { page = 1, limit = 10, status } = httpRequest.query;
      const params: GetEnrollmentsRequestDTO = {
        page: Number(page),
        limit: Number(limit),
        status: status as string,
      };

      const result = await this.getEnrollmentsUseCase.execute(params);
      if (!result.success) {
        return { statusCode: 400, body: { message: "Failed to get enrollments" } };
      }

      return { statusCode: 200, body: result.data };
    } catch (error) {
      return { statusCode: 500, body: { message: "Internal server error" } };
    }
  }

  async getEnrollmentDetails(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params;
      const params: GetCourseRequestDetailsRequestDTO = { id };

      const result = await this.getCourseRequestDetailsUseCase.execute(params);
      if (!result.success) {
        return { statusCode: 400, body: { message: "Failed to get enrollment details" } };
      }

      if (!result.data) {
        return { statusCode: 404, body: { message: "Enrollment not found" } };
      }

      return { statusCode: 200, body: result.data };
    } catch (error) {
      return { statusCode: 500, body: { message: "Internal server error" } };
    }
  }

  async approveEnrollment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params;
      const params: ApproveEnrollmentRequestDTO = { id };

      const result = await this.approveEnrollmentUseCase.execute(params);
      if (!result.success) {
        return { statusCode: 400, body: { message: "Failed to approve enrollment" } };
      }

      return { statusCode: 200, body: { message: "Enrollment approved successfully" } };
    } catch (error) {
      return { statusCode: 500, body: { message: "Internal server error" } };
    }
  }

  async rejectEnrollment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params;
      const params: RejectEnrollmentRequestDTO = { id };

      const result = await this.rejectEnrollmentUseCase.execute(params);
      if (!result.success) {
        return { statusCode: 400, body: { message: "Failed to reject enrollment" } };
      }

      return { statusCode: 200, body: { message: "Enrollment rejected successfully" } };
    } catch (error) {
      return { statusCode: 500, body: { message: "Internal server error" } };
    }
  }
} 