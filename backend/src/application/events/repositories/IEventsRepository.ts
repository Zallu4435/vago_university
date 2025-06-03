import {
  GetEventsRequestDTO,
  GetEventByIdRequestDTO,
  CreateEventRequestDTO,
  UpdateEventRequestDTO,
  DeleteEventRequestDTO,
} from "../../../domain/events/dtos/EventRequestDTOs";
import {
  GetEventsResponseDTO,
  GetEventByIdResponseDTO,
  CreateEventResponseDTO,
  UpdateEventResponseDTO,
} from "../../../domain/events/dtos/EventResponseDTOs";
import {
  GetEventRequestsRequestDTO,
  ApproveEventRequestRequestDTO,
  RejectEventRequestRequestDTO,
  GetEventRequestDetailsRequestDTO,
} from "../../../domain/events/dtos/EventRequestRequestDTOs";
import {
  GetEventRequestsResponseDTO,
  GetEventRequestDetailsResponseDTO,
} from "../../../domain/events/dtos/EventRequestResponseDTOs";

export interface IEventsRepository {
  getEvents(params: GetEventsRequestDTO): Promise<GetEventsResponseDTO>;
  getEventById(params: GetEventByIdRequestDTO): Promise<GetEventByIdResponseDTO | null>;
  createEvent(params: CreateEventRequestDTO): Promise<CreateEventResponseDTO>;
  updateEvent(params: UpdateEventRequestDTO): Promise<UpdateEventResponseDTO | null>;
  deleteEvent(params: DeleteEventRequestDTO): Promise<void>;
  getEventRequests(params: GetEventRequestsRequestDTO): Promise<GetEventRequestsResponseDTO>;
  approveEventRequest(params: ApproveEventRequestRequestDTO): Promise<void>;
  rejectEventRequest(params: RejectEventRequestRequestDTO): Promise<void>;
  getEventRequestDetails(
    params: GetEventRequestDetailsRequestDTO
  ): Promise<GetEventRequestDetailsResponseDTO | null>;
}