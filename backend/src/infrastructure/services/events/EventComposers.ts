import { IEventsRepository } from "../../../application/events/repositories/IEventsRepository";
import { GetEventsUseCase, GetEventByIdUseCase, CreateEventUseCase, UpdateEventUseCase, DeleteEventUseCase } from "../../../application/events/useCases/EventUseCases";
import { EventController } from "../../../presentation/http/events/EventController";
import { EventsRepository } from "../../repositories/events/EventsRepository";
import { IEventController } from "../../../presentation/http/IHttp";

export function getEventsComposer(): IEventController {
  const repository: IEventsRepository = new EventsRepository();
  const getEventsUseCase: GetEventsUseCase = new GetEventsUseCase(repository);
  const getEventByIdUseCase: GetEventByIdUseCase = new GetEventByIdUseCase(repository);
  const createEventUseCase: CreateEventUseCase = new CreateEventUseCase(repository);
  const updateEventUseCase: UpdateEventUseCase = new UpdateEventUseCase(repository);
  const deleteEventUseCase: DeleteEventUseCase = new DeleteEventUseCase(repository);
  return new EventController(
    getEventsUseCase,
    getEventByIdUseCase,
    createEventUseCase,
    updateEventUseCase,
    deleteEventUseCase
  );
}