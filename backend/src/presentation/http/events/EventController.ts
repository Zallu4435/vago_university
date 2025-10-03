import { IGetEventsUseCase, IGetEventByIdUseCase, ICreateEventUseCase, IUpdateEventUseCase, IDeleteEventUseCase } from "../../../application/events/useCases/IEventUseCases";
import { GetEventsRequestDTO, GetEventByIdRequestDTO, CreateEventRequestDTO, UpdateEventRequestDTO, DeleteEventRequestDTO } from "../../../domain/events/dtos/EventRequestDTOs";
import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IEventController } from "../IHttp";

export class EventController implements IEventController {
  private _httpErrors: HttpErrors;
  private _httpSuccess: HttpSuccess;

  constructor(
    private _getEventsUseCase: IGetEventsUseCase,
    private _getEventByIdUseCase: IGetEventByIdUseCase,
    private _createEventUseCase: ICreateEventUseCase,
    private _updateEventUseCase: IUpdateEventUseCase,
    private _deleteEventUseCase: IDeleteEventUseCase
  ) {
    this._httpErrors = new HttpErrors();
    this._httpSuccess = new HttpSuccess();
  }

  async getEvents(httpRequest: IHttpRequest): Promise<IHttpResponse> {
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
    
    const getEventsRequestDTO: GetEventsRequestDTO = {
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
        
    const response = await this._getEventsUseCase.execute(getEventsRequestDTO);
    return this._httpSuccess.success_200(response);
  }

  async getEventById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id) {
      return this._httpErrors.error_400();
    }
    const getEventByIdRequestDTO: GetEventByIdRequestDTO = { id };
    const response = await this._getEventByIdUseCase.execute(getEventByIdRequestDTO);
    return this._httpSuccess.success_200(response);
  }

  async createEvent(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.body || Object.keys(httpRequest.body).length === 0) {
      return this._httpErrors.error_400();
    }
    const createEventRequestDTO: CreateEventRequestDTO = httpRequest.body;
    const response = await this._createEventUseCase.execute(createEventRequestDTO);
    return this._httpSuccess.success_201(response);
  }

  async updateEvent(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id || !httpRequest.body || Object.keys(httpRequest.body).length === 0) {
      return this._httpErrors.error_400();
    }
    const updateEventRequestDTO: UpdateEventRequestDTO = { id, ...httpRequest.body };
    const response = await this._updateEventUseCase.execute(updateEventRequestDTO);
    return this._httpSuccess.success_200(response);
  }

  async deleteEvent(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id) {
      return this._httpErrors.error_400();
    }
    const deleteEventRequestDTO: DeleteEventRequestDTO = { id };
    const response = await this._deleteEventUseCase.execute(deleteEventRequestDTO);
    return this._httpSuccess.success_200(response);
  }
}