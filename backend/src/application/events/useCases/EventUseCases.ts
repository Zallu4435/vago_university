import { GetEventsRequestDTO, GetEventByIdRequestDTO, CreateEventRequestDTO, UpdateEventRequestDTO, DeleteEventRequestDTO } from "../../../domain/events/dtos/EventRequestDTOs";
import { GetEventsResponseDTO, GetEventByIdResponseDTO, CreateEventResponseDTO, UpdateEventResponseDTO } from "../../../domain/events/dtos/EventResponseDTOs";
import { IEventsRepository } from "../repositories/IEventsRepository";
import { Event } from "../../../domain/events/entities/Event";
import { InvalidEventIdError, EventNotFoundError } from "../../../domain/events/errors/EventErrors";
import { OrganizerType, EventType, Timeframe, EventStatus } from "../../../domain/events/entities/Event";

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

export class GetEventsUseCase implements IGetEventsUseCase {
  constructor(private eventsRepository: IEventsRepository) {}

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
    const result: any = await this.eventsRepository.getEvents(
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
    const mappedEvents = result.events.map((event) => ({
      id: event._id.toString(),
      title: event.title,
      organizerType: event.organizerType,
      eventType: event.eventType,
      location: event.location,
      timeframe: event.timeframe,
      status: event.status,
      date: event.date
    }));
    return {
      data: mappedEvents,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
    };
  }
}

export class GetEventByIdUseCase implements IGetEventByIdUseCase {
  constructor(private eventsRepository: IEventsRepository) {}

  async execute(params: GetEventByIdRequestDTO): Promise<GetEventByIdResponseDTO> {
    if (!params.id) {
      throw new InvalidEventIdError(params.id);
    }
    const event: any = await this.eventsRepository.getEventById(params.id);
    if (!event) {
      throw new EventNotFoundError(params.id);
    }
    return {
      event: new Event({
        id: event._id.toString(),
        title: event.title,
        organizer: event.organizer,
        organizerType: event.organizerType,
        eventType: event.eventType,
        date: event.date,
        time: event.time,
        location: event.location,
        timeframe: event.timeframe,
        status: event.status,
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
  constructor(private eventsRepository: IEventsRepository) {}

  async execute(params: CreateEventRequestDTO): Promise<CreateEventResponseDTO> {
    const event = Event.create(mapCreateEventDTOToEventProps(params));
    const newEvent: any = await this.eventsRepository.createEvent(event);
    return {
      event: new Event({
        id: newEvent._id.toString(),
        title: newEvent.title,
        organizer: newEvent.organizer,
        organizerType: newEvent.organizerType,
        eventType: newEvent.eventType,
        date: newEvent.date,
        time: newEvent.time,
        location: newEvent.location,
        timeframe: newEvent.timeframe,
        status: newEvent.status,
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
  constructor(private eventsRepository: IEventsRepository) {}

  async execute(params: UpdateEventRequestDTO): Promise<UpdateEventResponseDTO> {
    if (!params.id) {
      throw new InvalidEventIdError(params.id);
    }
    const event = Event.create(mapUpdateEventDTOToEventProps(params));
    const updatedEvent: any = await this.eventsRepository.updateEvent(event);
    if (!updatedEvent) {
      throw new EventNotFoundError(params.id);
    }
    return {
      event: new Event({
        id: updatedEvent._id.toString(),
        title: updatedEvent.title,
        organizer: updatedEvent.organizer,
        organizerType: updatedEvent.organizerType,
        eventType: updatedEvent.eventType,
        date: updatedEvent.date,
        time: updatedEvent.time,
        location: updatedEvent.location,
        timeframe: updatedEvent.timeframe,
        status: updatedEvent.status,
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
  constructor(private eventsRepository: IEventsRepository) {}

  async execute(params: DeleteEventRequestDTO): Promise<{ message: string }> {
    if (!params.id) {
      throw new InvalidEventIdError(params.id);
    }

    await this.eventsRepository.deleteEvent(params.id);
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