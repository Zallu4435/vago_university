import { GetEventsRequestDTO, GetEventByIdRequestDTO, CreateEventRequestDTO, UpdateEventRequestDTO, DeleteEventRequestDTO } from "../../../domain/events/dtos/EventRequestDTOs";
import { GetEventsResponseDTO, GetEventByIdResponseDTO, CreateEventResponseDTO, UpdateEventResponseDTO, EventSummaryDTO } from "../../../domain/events/dtos/EventResponseDTOs";
import { IEventsRepository } from "../repositories/IEventsRepository";
import { Event, PaginatedResponse, EventSummary, EventDocument } from "../../../domain/events/entities/Event";
import { InvalidEventIdError, EventNotFoundError } from "../../../domain/events/errors/EventErrors";
import { OrganizerType, EventType, Timeframe, EventStatus } from "../../../domain/events/entities/EventTypes";
import {
  IGetEventsUseCase,
  IGetEventByIdUseCase,
  ICreateEventUseCase,
  IUpdateEventUseCase,
  IDeleteEventUseCase
} from "./IEventUseCases";

export class GetEventsUseCase implements IGetEventsUseCase {
  constructor(private _eventsRepository: IEventsRepository) { }

  async execute(params: GetEventsRequestDTO): Promise<GetEventsResponseDTO> {
    if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
      throw new Error("Invalid page or limit parameters");
    }
    if (params.startDate && isNaN(params.startDate.getTime())) {
      throw new Error("Invalid startDate format");
    }
    if (params.endDate && isNaN(params.endDate.getTime())) {
      throw new Error("Invalid endDate format");
    }
    const result: PaginatedResponse<EventSummary> = await this._eventsRepository.getEvents(
      params.page,
      params.limit,
      params.type,
      params.status,
      params.startDate ? params.startDate.toISOString() : "",
      params.endDate ? params.endDate.toISOString() : "",
      params.search,
      params.organizerType,
      params.dateRange
    );
    const mappedEvents: EventSummaryDTO[] = result.events.map((event) => ({
      id: event._id.toString(),
      title: event.title,
      organizerType: event.organizerType as OrganizerType,
      eventType: event.eventType as EventType,
      location: event.location,
      timeframe: event.timeframe as Timeframe,
      status: event.status as EventStatus,
    }));
    return {
      events: mappedEvents,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
    };
  }
}

export class GetEventByIdUseCase implements IGetEventByIdUseCase {
  constructor(private _eventsRepository: IEventsRepository) { }

  async execute(params: GetEventByIdRequestDTO): Promise<GetEventByIdResponseDTO> {
    if (!params.id) {
      throw new InvalidEventIdError(params.id);
    }
    const event: EventDocument | null = await this._eventsRepository.getById(params.id);
    if (!event) {
      throw new EventNotFoundError(params.id);
    }
    return {
      event: new Event({
        id: event._id.toString(),
        title: event.title,
        organizer: event.organizer,
        organizerType: event.organizerType as OrganizerType,
        eventType: event.eventType as EventType,
        date: event.date,
        time: event.time,
        location: event.location,
        timeframe: event.timeframe as Timeframe,
        status: event.status as EventStatus,
        icon: event.icon,
        color: event.color,
        description: event.description,
        fullTime: event.fullTime,
        additionalInfo: event.additionalInfo || event.description,
        requirements: event.requirements,
        maxParticipants: event.maxParticipants,
        registrationRequired: event.registrationRequired,
        participants: event.participants,
      }),
    };
  }
}

export class CreateEventUseCase implements ICreateEventUseCase {
  constructor(private _eventsRepository: IEventsRepository) { }

  async execute(params: CreateEventRequestDTO): Promise<CreateEventResponseDTO> {
    const mappedParams = {
      ...params,
      eventType: (Object.values(EventType) as string[]).includes(params.eventType) ? params.eventType : undefined,
      organizerType: (Object.values(OrganizerType) as string[]).includes(params.organizerType) ? params.organizerType : undefined,
      status: (Object.values(EventStatus) as string[]).includes(params.status) ? params.status : undefined,
    };
    const event = Event.create(mapCreateEventDTOToEventProps(mappedParams));
    const eventObj = event.toPersistence();
    const newEvent: EventDocument = await this._eventsRepository.create(eventObj);
    return {
      event: new Event({
        id: newEvent._id.toString(),
        title: newEvent.title,
        organizer: newEvent.organizer,
        organizerType: newEvent.organizerType as OrganizerType,
        eventType: newEvent.eventType as EventType,
        date: newEvent.date,
        time: newEvent.time,
        location: newEvent.location,
        timeframe: newEvent.timeframe as Timeframe,
        status: newEvent.status as EventStatus,
        icon: newEvent.icon,
        color: newEvent.color,
        description: newEvent.description,
        fullTime: newEvent.fullTime,
        additionalInfo: newEvent.additionalInfo,
        requirements: newEvent.requirements,
        maxParticipants: newEvent.maxParticipants,
        registrationRequired: newEvent.registrationRequired,
        participants: newEvent.participants,
      }),
    };
  }
}

export class UpdateEventUseCase implements IUpdateEventUseCase {
  constructor(private _eventsRepository: IEventsRepository) { }

  async execute(params: UpdateEventRequestDTO): Promise<UpdateEventResponseDTO> {
    if (!params.id) {
      throw new InvalidEventIdError(params.id);
    }
    const mappedParams = {
      ...params,
      eventType: (Object.values(EventType) as string[]).includes(params.eventType) ? params.eventType : undefined,
      organizerType: (Object.values(OrganizerType) as string[]).includes(params.organizerType) ? params.organizerType : undefined,
      status: (Object.values(EventStatus) as string[]).includes(params.status) ? params.status : undefined,
    };
    const event = Event.create(mapUpdateEventDTOToEventProps(mappedParams));
    const eventObj = event.toPersistence();
    const updatedEvent: EventDocument | null = await this._eventsRepository.updateById(params.id, eventObj);
    if (!updatedEvent) {
      throw new EventNotFoundError(params.id);
    }
    return {
      event: new Event({
        id: updatedEvent._id.toString(),
        title: updatedEvent.title,
        organizer: updatedEvent.organizer,
        organizerType: updatedEvent.organizerType as OrganizerType,
        eventType: updatedEvent.eventType as EventType,
        date: updatedEvent.date,
        time: updatedEvent.time,
        location: updatedEvent.location,
        timeframe: updatedEvent.timeframe as Timeframe,
        status: updatedEvent.status as EventStatus,
        icon: updatedEvent.icon,
        color: updatedEvent.color,
        description: updatedEvent.description,
        fullTime: updatedEvent.fullTime,
        additionalInfo: updatedEvent.additionalInfo,
        requirements: updatedEvent.requirements,
        maxParticipants: updatedEvent.maxParticipants,
        registrationRequired: updatedEvent.registrationRequired,
        participants: updatedEvent.participants,
      }),
    };
  }
}

export class DeleteEventUseCase implements IDeleteEventUseCase {
  constructor(private _eventsRepository: IEventsRepository) { }

  async execute(params: DeleteEventRequestDTO): Promise<{ message: string }> {
    if (!params.id) {
      throw new InvalidEventIdError(params.id);
    }

    await this._eventsRepository.deleteById(params.id);
    return { message: "Event deleted successfully" };
  }
}

function mapCreateEventDTOToEventProps(dto: CreateEventRequestDTO) {
  return {
    title: dto.title,
    organizer: dto.organizer,
    organizerType: dto.organizerType,
    eventType: dto.eventType,
    date: dto.date,
    time: dto.time,
    location: dto.location,
    timeframe: dto.timeframe,
    status: dto.status,
    icon: dto.icon,
    color: dto.color,
    description: dto.description,
    fullTime: dto.fullTime,
    additionalInfo: dto.additionalInfo,
    requirements: dto.requirements,
    maxParticipants: dto.maxParticipants,
    registrationRequired: dto.registrationRequired,
    participants: dto.participants,
  };
}

function mapUpdateEventDTOToEventProps(dto: UpdateEventRequestDTO) {
  return {
    id: dto.id,
    title: dto.title ?? "",
    organizer: dto.organizer ?? "",
    organizerType: dto.organizerType ?? OrganizerType.Department,
    eventType: dto.eventType ?? EventType.Workshop,
    date: dto.date ?? "",
    time: dto.time ?? "",
    location: dto.location ?? "",
    timeframe: dto.timeframe ?? Timeframe.Morning,
    status: dto.status ?? EventStatus.Upcoming,
    icon: dto.icon,
    color: dto.color,
    description: dto.description,
    fullTime: dto.fullTime,
    additionalInfo: dto.additionalInfo,
    requirements: dto.requirements,
    maxParticipants: dto.maxParticipants,
    registrationRequired: dto.registrationRequired,
    participants: dto.participants,
  };
}