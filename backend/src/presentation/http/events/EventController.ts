import { IGetEventsUseCase } from "../../../application/events/useCases/EventUseCases";
import { IGetEventByIdUseCase } from "../../../application/events/useCases/EventUseCases";
import { ICreateEventUseCase } from "../../../application/events/useCases/EventUseCases";
import { IUpdateEventUseCase } from "../../../application/events/useCases/EventUseCases";
import { IDeleteEventUseCase } from "../../../application/events/useCases/EventUseCases";
import { GetEventsRequestDTO, GetEventByIdRequestDTO, CreateEventRequestDTO, UpdateEventRequestDTO, DeleteEventRequestDTO } from "../../../domain/events/dtos/EventRequestDTOs";
import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IEventController } from "../IHttp";

export class EventController implements IEventController {
  private httpErrors: HttpErrors;
  private httpSuccess: HttpSuccess;

  constructor(
    private getEventsUseCase: IGetEventsUseCase,
    private getEventByIdUseCase: IGetEventByIdUseCase,
    private createEventUseCase: ICreateEventUseCase,
    private updateEventUseCase: IUpdateEventUseCase,
    private deleteEventUseCase: IDeleteEventUseCase
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async getEvents(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { page = "1", limit = "10", type = "all", status = "all", startDate, endDate } = httpRequest.query || {};
    const getEventsRequestDTO: GetEventsRequestDTO = {
      page: Number(page),
      limit: Number(limit),
      type: String(type),
      status: String(status),
      startDate: startDate ? new Date(String(startDate)) : undefined,
      endDate: endDate ? new Date(String(endDate)) : undefined,
    };
    const response = await this.getEventsUseCase.execute(getEventsRequestDTO);
    return this.httpSuccess.success_200(response);
  }

  async getEventById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id) {
      return this.httpErrors.error_400();
    }
    const getEventByIdRequestDTO: GetEventByIdRequestDTO = { id };
    const response = await this.getEventByIdUseCase.execute(getEventByIdRequestDTO);
    return this.httpSuccess.success_200(response);
  }

  async createEvent(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.body || Object.keys(httpRequest.body).length === 0) {
      return this.httpErrors.error_400();
    }
    const createEventRequestDTO: CreateEventRequestDTO = httpRequest.body;
    const response = await this.createEventUseCase.execute(createEventRequestDTO);
    return this.httpSuccess.success_201(response);
  }

  async updateEvent(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id || !httpRequest.body || Object.keys(httpRequest.body).length === 0) {
      return this.httpErrors.error_400();
    }
    const updateEventRequestDTO: UpdateEventRequestDTO = { id, ...httpRequest.body };
    const response = await this.updateEventUseCase.execute(updateEventRequestDTO);
    return this.httpSuccess.success_200(response);
  }

  async deleteEvent(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params || {};
    if (!id) {
      return this.httpErrors.error_400();
    }
    const deleteEventRequestDTO: DeleteEventRequestDTO = { id };
    const response = await this.deleteEventUseCase.execute(deleteEventRequestDTO);
    return this.httpSuccess.success_200(response);
  }
}