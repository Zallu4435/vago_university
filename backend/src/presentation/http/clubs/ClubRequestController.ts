import {
  IGetClubRequestsUseCase,
  IApproveClubRequestUseCase,
  IRejectClubRequestUseCase,
  IGetClubRequestDetailsUseCase
} from "../../../application/clubs/useCases/IClubRequestUseCases";
import {
  GetClubRequestsRequestDTO,
  ApproveClubRequestRequestDTO,
  RejectClubRequestRequestDTO,
  GetClubRequestDetailsRequestDTO,
} from "../../../domain/clubs/dtos/ClubRequestRequestDTOs";
import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IClubRequestController } from "../IHttp";

export class ClubRequestController implements IClubRequestController {
  private _httpErrors: HttpErrors;
  private _httpSuccess: HttpSuccess;

  constructor(
    private _getClubRequestsUseCase: IGetClubRequestsUseCase,
    private _approveClubRequestUseCase: IApproveClubRequestUseCase,
    private _rejectClubRequestUseCase: IRejectClubRequestUseCase,
    private _getClubRequestDetailsUseCase: IGetClubRequestDetailsUseCase
  ) {
    this._httpErrors = new HttpErrors();
    this._httpSuccess = new HttpSuccess();
  }

  async getClubRequests(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { page = "1", limit = "10", status = "all", category = "all", startDate, endDate, search } = httpRequest.query || {};
    const getClubRequestsRequestDTO: GetClubRequestsRequestDTO = {
      page: Number(page),
      limit: Number(limit),
      status: String(status),
      type: String(category),
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      search: search ? String(search) : undefined,
    };
    const response = await this._getClubRequestsUseCase.execute(getClubRequestsRequestDTO);
    return this._httpSuccess.success_200(response);
  }

  async approveClubRequest(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id) {
      return this._httpErrors.error_400();
    }
    const approveClubRequestRequestDTO: ApproveClubRequestRequestDTO = { id };
    const response = await this._approveClubRequestUseCase.execute(approveClubRequestRequestDTO);
    return this._httpSuccess.success_200(response);
  }

  async rejectClubRequest(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id) {
      return this._httpErrors.error_400();
    }
    const rejectClubRequestRequestDTO: RejectClubRequestRequestDTO = { id };
    const response = await this._rejectClubRequestUseCase.execute(rejectClubRequestRequestDTO);
    return this._httpSuccess.success_200(response);
  }

  async getClubRequestDetails(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id) {
      return this._httpErrors.error_400();
    }
    const getClubRequestDetailsRequestDTO: GetClubRequestDetailsRequestDTO = { id };
    const response = await this._getClubRequestDetailsUseCase.execute(getClubRequestDetailsRequestDTO);
    return this._httpSuccess.success_200(response);
  }
}