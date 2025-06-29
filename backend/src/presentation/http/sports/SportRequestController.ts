import {
  IGetSportRequestsUseCase,
  IApproveSportRequestUseCase,
  IRejectSportRequestUseCase,
  IGetSportRequestDetailsUseCase,
  IJoinSportUseCase,
} from "../../../application/sports/useCases/SportRequestUseCases";
import { ISportRequestController, IHttpRequest, IHttpResponse, HttpSuccess, HttpErrors } from "../IHttp";

export class SportRequestController implements ISportRequestController {
  private httpSuccess: HttpSuccess;
  private httpErrors: HttpErrors;

  constructor(
    private readonly getSportRequestsUseCase: IGetSportRequestsUseCase,
    private readonly approveSportRequestUseCase: IApproveSportRequestUseCase,
    private readonly rejectSportRequestUseCase: IRejectSportRequestUseCase,
    private readonly getSportRequestDetailsUseCase: IGetSportRequestDetailsUseCase,
    private readonly joinSportUseCase: IJoinSportUseCase
  ) {
    this.httpSuccess = new HttpSuccess();
    this.httpErrors = new HttpErrors();
  }

  async getSportRequests(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const {
        page = "1",
        limit = "10",
        status = "all",
        type = "all",
        startDate,
        endDate,
      } = httpRequest.query;

      if (
        isNaN(Number(page)) ||
        isNaN(Number(limit)) ||
        Number(page) < 1 ||
        Number(limit) < 1
      ) {
        return this.httpErrors.error_400();
      }

      const result = await this.getSportRequestsUseCase.execute({
        page: Number(page),
        limit: Number(limit),
        status: String(status),
        type: String(type),
        startDate: startDate ? String(startDate) : undefined,
        endDate: endDate ? String(endDate) : undefined,
      });

      if (!result.success || 'error' in result.data) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200({
        data: result.data.requests,
        totalPages: result.data.totalPages,
        totalItems: result.data.totalItems,
        currentPage: result.data.currentPage,
      });
    } catch (err) {
      console.error(`Error in getSportRequests:`, err);
      return this.httpErrors.error_400();
    }
  }

  async approveSportRequest(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params;

      if (!id) {
        return this.httpErrors.error_400();
      }

      await this.approveSportRequestUseCase.execute({ id });
      return this.httpSuccess.success_200({ message: "Sport request approved successfully" });
    } catch (err) {
      console.error(`Error in approveSportRequest:`, err);
      return this.httpErrors.error_400();
    }
  }

  async rejectSportRequest(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params;

      if (!id) {
        return this.httpErrors.error_400();
      }

      await this.rejectSportRequestUseCase.execute({ id });
      return this.httpSuccess.success_200({ message: "Sport request rejected successfully" });
    } catch (err) {
      console.error(`Error in rejectSportRequest:`, err);
      return this.httpErrors.error_400();
    }
  }

  async getSportRequestDetails(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params;

      if (!id) {
        return this.httpErrors.error_400();
      }

      const requestDetails = await this.getSportRequestDetailsUseCase.execute({ id });
      if (!requestDetails) {
        return this.httpErrors.error_404();
      }

      return this.httpSuccess.success_200(requestDetails);
    } catch (err) {
      console.error(`Error in getSportRequestDetails:`, err);
      return this.httpErrors.error_400();
    }
  }

  async joinSport(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { sportId } = httpRequest.params;
      const { reason, additionalInfo } = httpRequest.body;
      const studentId = httpRequest.headers?.user?.id;

      if (!sportId) {
        return this.httpErrors.error_400();
      }

      if (!studentId) {
        return this.httpErrors.error_400();
      }

      if (!reason) {
        return this.httpErrors.error_400();
      }

      const result = await this.joinSportUseCase.execute({
        sportId,
        studentId,
        reason,
        additionalInfo,
      });

      if (!result.success || 'error' in result.data) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200({
        success: true,
        message: "Join request submitted successfully.",
        requestId: result.data.requestId,
        status: result.data.status,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error(`Error in joinSport:`, error);
      if (error.message?.includes("not found")) {
        return this.httpErrors.error_404();
      }
      return this.httpErrors.error_500();
    }
  }
} 