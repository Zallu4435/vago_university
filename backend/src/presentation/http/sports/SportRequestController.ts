import {
  IGetSportRequestsUseCase,
  IApproveSportRequestUseCase,
  IRejectSportRequestUseCase,
  IGetSportRequestDetailsUseCase,
  IJoinSportUseCase,
} from "../../../application/sports/useCases/ISportRequestUseCases";
import { ISportRequestController, IHttpRequest, IHttpResponse, HttpSuccess, HttpErrors } from "../IHttp";

export class SportRequestController implements ISportRequestController {
  private _httpSuccess: HttpSuccess;
  private _httpErrors: HttpErrors;

  constructor(
    private readonly _getSportRequestsUseCase: IGetSportRequestsUseCase,
    private readonly _approveSportRequestUseCase: IApproveSportRequestUseCase,
    private readonly _rejectSportRequestUseCase: IRejectSportRequestUseCase,
    private readonly _getSportRequestDetailsUseCase: IGetSportRequestDetailsUseCase,
    private readonly _joinSportUseCase: IJoinSportUseCase
  ) {
    this._httpSuccess = new HttpSuccess();
    this._httpErrors = new HttpErrors();
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
      return this._httpErrors.error_400();
    }

    const result = await this._getSportRequestsUseCase.execute({
      page: Number(page),
      limit: Number(limit),
      status: String(status),
      type: String(type),
      startDate: startDate ? String(startDate) : undefined,
      endDate: endDate ? String(endDate) : undefined,
      search: search ? String(search) : undefined,
    });

    return this._httpSuccess.success_200({
      data: result.data,
      totalPages: result.totalPages,
      totalItems: result.totalItems,
      currentPage: result.currentPage,
    });
  }

  async approveSportRequest(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;

    if (!id) {
      return this._httpErrors.error_400();
    }

    const result = await this._approveSportRequestUseCase.execute({ id });
    return this._httpSuccess.success_200(result);
  }

  async rejectSportRequest(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;

    if (!id) {
      return this._httpErrors.error_400();
    }

    const result = await this._rejectSportRequestUseCase.execute({ id });
    return this._httpSuccess.success_200(result);
  }

  async getSportRequestDetails(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;

    if (!id) {
      return this._httpErrors.error_400();
    }

    const requestDetails = await this._getSportRequestDetailsUseCase.execute({ id });
    return this._httpSuccess.success_200(requestDetails);
  }

  async joinSport(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { sportId } = httpRequest.params;
    const { reason, additionalInfo } = httpRequest.body;
    const studentId = httpRequest.headers?.user?.id;

    if (!sportId) {
      return this._httpErrors.error_400();
    }

    if (!studentId) {
      return this._httpErrors.error_400();
    }

    if (!reason) {
      return this._httpErrors.error_400();
    }

    const result = await this._joinSportUseCase.execute({
      sportId,
      studentId,
      reason,
      additionalInfo,
    });

    return this._httpSuccess.success_200(result);
  }
} 