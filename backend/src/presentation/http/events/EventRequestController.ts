import { IGetEventRequestsUseCase, IApproveEventRequestUseCase, IRejectEventRequestUseCase, IGetEventRequestDetailsUseCase } from "../../../application/events/useCases/EventRequestUseCases";
import { GetEventRequestsRequestDTO, ApproveEventRequestRequestDTO, RejectEventRequestRequestDTO, GetEventRequestDetailsRequestDTO } from "../../../domain/events/dtos/EventRequestRequestDTOs";
import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IEventRequestController } from "../IHttp";

export class EventRequestController implements IEventRequestController {
  private httpErrors: HttpErrors;
  private httpSuccess: HttpSuccess;

  constructor(
    private getEventRequestsUseCase: IGetEventRequestsUseCase,
    private approveEventRequestUseCase: IApproveEventRequestUseCase,
    private rejectEventRequestUseCase: IRejectEventRequestUseCase,
    private getEventRequestDetailsUseCase: IGetEventRequestDetailsUseCase
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async getEventRequests(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { page = "1", limit = "10", type = "all", status = "all", startDate, endDate } = httpRequest.query || {};
      const getEventRequestsRequestDTO: GetEventRequestsRequestDTO = {
        page: Number(page),
        limit: Number(limit),
        type: String(type),
        status: String(status),
        startDate: startDate ? new Date(String(startDate)) : undefined,
        endDate: endDate ? new Date(String(endDate)) : undefined,
      };
      const response = await this.getEventRequestsUseCase.execute(getEventRequestsRequestDTO);
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      if ('error' in response.data) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200({
        eventRequests: response.data.data,
        totalItems: response.data.totalItems,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
      });
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }
  async approveEventRequest(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.path || {};
      if (!id) {
        return this.httpErrors.error_400();
      }
      const approveEventRequestRequestDTO: ApproveEventRequestRequestDTO = { id };
      const response = await this.approveEventRequestUseCase.execute(approveEventRequestRequestDTO);
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async rejectEventRequest(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.path || {};
      if (!id) {
        return this.httpErrors.error_400();
      }
      const rejectEventRequestRequestDTO: RejectEventRequestRequestDTO = { id };
      const response = await this.rejectEventRequestUseCase.execute(rejectEventRequestRequestDTO);
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async getEventRequestDetails(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.path || {};
      if (!id) {
        return this.httpErrors.error_400();
      }
      const getEventRequestDetailsRequestDTO: GetEventRequestDetailsRequestDTO = { id };
      const response = await this.getEventRequestDetailsUseCase.execute(getEventRequestDetailsRequestDTO);
      if (!response.success) {
        if ('error' in response.data && response.data.error === "Event request not found!") {
          return this.httpErrors.error_404();
        }
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }
}