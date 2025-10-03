import { GetEventsRequestDTO, GetEventByIdRequestDTO, CreateEventRequestDTO, UpdateEventRequestDTO, DeleteEventRequestDTO } from "../../../domain/events/dtos/EventRequestDTOs";
import { GetEventsResponseDTO, GetEventByIdResponseDTO, CreateEventResponseDTO, UpdateEventResponseDTO, EventSummaryDTO } from "../../../domain/events/dtos/EventResponseDTOs";

export interface IGetEventsUseCase {
  execute(params: GetEventsRequestDTO): Promise<GetEventsResponseDTO>;
}

export interface IGetEventByIdUseCase {
  execute(params: GetEventByIdRequestDTO): Promise<GetEventByIdResponseDTO>;
}

export interface ICreateEventUseCase {
  execute(params: CreateEventRequestDTO): Promise<CreateEventResponseDTO>;
}

export interface IUpdateEventUseCase {
  execute(params: UpdateEventRequestDTO): Promise<UpdateEventResponseDTO>;
}

export interface IDeleteEventUseCase {
  execute(params: DeleteEventRequestDTO): Promise<{ message: string }>;
}
