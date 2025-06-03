import { GetEventsRequestDTO, GetEventByIdRequestDTO, CreateEventRequestDTO, UpdateEventRequestDTO, DeleteEventRequestDTO } from "../../../domain/events/dtos/EventRequestDTOs";
import { GetEventsResponseDTO, GetEventByIdResponseDTO, CreateEventResponseDTO, UpdateEventResponseDTO } from "../../../domain/events/dtos/EventResponseDTOs";
import { IEventsRepository } from "../repositories/IEventsRepository";
import { EventErrorType } from "../../../domain/events/enums/EventErrorType";
import mongoose from "mongoose";
import { Event } from "../../../domain/events/entities/Event";

interface ResponseDTO<T> {
  data: T | { error: string };
  success: boolean;
}

export interface IGetEventsUseCase {
  execute(params: GetEventsRequestDTO): Promise<ResponseDTO<GetEventsResponseDTO>>;
}

export interface IGetEventByIdUseCase {
  execute(params: GetEventByIdRequestDTO): Promise<ResponseDTO<GetEventByIdResponseDTO>>;
}

export interface ICreateEventUseCase {
  execute(params: CreateEventRequestDTO): Promise<ResponseDTO<CreateEventResponseDTO>>;
}

export interface IUpdateEventUseCase {
  execute(params: UpdateEventRequestDTO): Promise<ResponseDTO<UpdateEventResponseDTO>>;
}

export interface IDeleteEventUseCase {
  execute(params: DeleteEventRequestDTO): Promise<ResponseDTO<{ message: string }>>;
}

export class GetEventsUseCase implements IGetEventsUseCase {
  constructor(private eventsRepository: IEventsRepository) {}

  async execute(params: GetEventsRequestDTO): Promise<ResponseDTO<GetEventsResponseDTO>> {
    try {
      if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
        return { data: { error: "Invalid page or limit parameters" }, success: false };
      }
      if (params.startDate && isNaN(params.startDate.getTime())) {
        return { data: { error: "Invalid startDate format" }, success: false };
      }
      if (params.endDate && isNaN(params.endDate.getTime())) {
        return { data: { error: "Invalid endDate format" }, success: false };
      }
      const result = await this.eventsRepository.getEvents(params);
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class GetEventByIdUseCase implements IGetEventByIdUseCase {
  constructor(private eventsRepository: IEventsRepository) {}

  async execute(params: GetEventByIdRequestDTO): Promise<ResponseDTO<GetEventByIdResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.id)) {
        return { data: { error: EventErrorType.InvalidEventId }, success: false };
      }
      const result = await this.eventsRepository.getEventById(params);
      if (!result) {
        return { data: { error: EventErrorType.EventNotFound }, success: false };
      }
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class CreateEventUseCase implements ICreateEventUseCase {
  constructor(private eventsRepository: IEventsRepository) {}

  async execute(params: CreateEventRequestDTO): Promise<ResponseDTO<CreateEventResponseDTO>> {
    try {
      const event = Event.create(params);
      const result = await this.eventsRepository.createEvent(params);
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class UpdateEventUseCase implements IUpdateEventUseCase {
  constructor(private eventsRepository: IEventsRepository) {}

  async execute(params: UpdateEventRequestDTO): Promise<ResponseDTO<UpdateEventResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.id)) {
        return { data: { error: EventErrorType.InvalidEventId }, success: false };
      }
      const result = await this.eventsRepository.updateEvent(params);
      if (!result) {
        return { data: { error: EventErrorType.EventNotFound }, success: false };
      }
      return { data: result, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}

export class DeleteEventUseCase implements IDeleteEventUseCase {
  constructor(private eventsRepository: IEventsRepository) {}

  async execute(params: DeleteEventRequestDTO): Promise<ResponseDTO<{ message: string }>> {
    try {
      if (!mongoose.isValidObjectId(params.id)) {
        return { data: { error: EventErrorType.InvalidEventId }, success: false };
      }
      await this.eventsRepository.deleteEvent(params);
      return { data: { message: "Event deleted successfully" }, success: true };
    } catch (error: any) {
      return { data: { error: error.message }, success: false };
    }
  }
}