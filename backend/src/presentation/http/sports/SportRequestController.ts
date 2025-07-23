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
    const {
      page = "1",
      limit = "10",
      status = "all",
      type = "all",
      startDate,
      endDate,
      search,
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
      search: search ? String(search) : undefined,
    });

    return this.httpSuccess.success_200({
      data: result.data,
      totalPages: result.totalPages,
      totalItems: result.totalItems,
      currentPage: result.currentPage,
    });
  }

  async approveSportRequest(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;

    if (!id) {
      return this.httpErrors.error_400();
    }

    const result = await this.approveSportRequestUseCase.execute({ id });
    return this.httpSuccess.success_200(result);
  }

  async rejectSportRequest(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;

    if (!id) {
      return this.httpErrors.error_400();
    }

    const result = await this.rejectSportRequestUseCase.execute({ id });
    return this.httpSuccess.success_200(result);
  }

  async getSportRequestDetails(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;

    if (!id) {
      return this.httpErrors.error_400();
    }

    const requestDetails = await this.getSportRequestDetailsUseCase.execute({ id });
    return this.httpSuccess.success_200(requestDetails);
  }

  async joinSport(httpRequest: IHttpRequest): Promise<IHttpResponse> {
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

    return this.httpSuccess.success_200(result);
  }
} 