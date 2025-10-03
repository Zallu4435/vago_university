import { IGetEventRequestsUseCase, IApproveEventRequestUseCase, IRejectEventRequestUseCase, IGetEventRequestDetailsUseCase } from "../../../application/events/useCases/IEventRequestUseCases";
import { GetEventRequestsRequestDTO, ApproveEventRequestRequestDTO, RejectEventRequestRequestDTO, GetEventRequestDetailsRequestDTO } from "../../../domain/events/dtos/EventRequestRequestDTOs";
import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IEventRequestController } from "../IHttp";

export class EventRequestController implements IEventRequestController {
  private _httpErrors: HttpErrors;
  private _httpSuccess: HttpSuccess;

  constructor(
    private _getEventRequestsUseCase: IGetEventRequestsUseCase,
    private _approveEventRequestUseCase: IApproveEventRequestUseCase,
    private _rejectEventRequestUseCase: IRejectEventRequestUseCase,
    private _getEventRequestDetailsUseCase: IGetEventRequestDetailsUseCase
  ) {
    this._httpErrors = new HttpErrors();
    this._httpSuccess = new HttpSuccess();
  }

  async getEventRequests(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { 
      page = "1", 
      limit = "10", 
      type = "all", 
      status = "all", 
      startDate, 
      endDate,
      search,
      organizerType = "all",
      dateRange = "all"
    } = httpRequest.query || {};
    
    const getEventRequestsRequestDTO: GetEventRequestsRequestDTO = {
      page: Number(page),
      limit: Number(limit),
      type: String(type),
      status: String(status),
      startDate: startDate ? new Date(String(startDate)) : undefined,
      endDate: endDate ? new Date(String(endDate)) : undefined,
      search: search ? String(search) : undefined,
      organizerType: String(organizerType),
      dateRange: String(dateRange),
    };
    
    console.log('Event request controller received parameters:', getEventRequestsRequestDTO);
    
    const response = await this._getEventRequestsUseCase.execute(getEventRequestsRequestDTO);
    return this._httpSuccess.success_200({
      eventRequests: response.data,
      totalItems: response.totalItems,
      totalPages: response.totalPages,
      currentPage: response.currentPage,
    });
  }

  async approveEventRequest(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id) {
      return this._httpErrors.error_400();
    }
    const approveEventRequestRequestDTO: ApproveEventRequestRequestDTO = { id };
    const response = await this._approveEventRequestUseCase.execute(approveEventRequestRequestDTO);
    return this._httpSuccess.success_200(response);
  }

  async rejectEventRequest(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id) {
      return this._httpErrors.error_400();
    }
    const rejectEventRequestRequestDTO: RejectEventRequestRequestDTO = { id };
    const response = await this._rejectEventRequestUseCase.execute(rejectEventRequestRequestDTO);
    return this._httpSuccess.success_200(response);
  }

  async getEventRequestDetails(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id) {
      return this._httpErrors.error_400();
    }
    const getEventRequestDetailsRequestDTO: GetEventRequestDetailsRequestDTO = { id };
    const response = await this._getEventRequestDetailsUseCase.execute(getEventRequestDetailsRequestDTO);
    return this._httpSuccess.success_200(response);
  }
}