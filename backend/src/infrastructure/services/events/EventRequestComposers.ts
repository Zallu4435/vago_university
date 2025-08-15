import { IEventsRepository } from "../../../application/events/repositories/IEventsRepository";
import { GetEventRequestsUseCase, ApproveEventRequestUseCase, RejectEventRequestUseCase, GetEventRequestDetailsUseCase } from "../../../application/events/useCases/EventRequestUseCases";
import { EventRequestController } from "../../../presentation/http/events/EventRequestController";
import { EventsRepository } from "../../repositories/events/EventsRepository";
import { IEventRequestController } from "../../../presentation/http/IHttp";

export function getEventRequestsComposer(): IEventRequestController {
  const repository: IEventsRepository = new EventsRepository();
  const getEventRequestsUseCase: GetEventRequestsUseCase = new GetEventRequestsUseCase(repository);
  const approveEventRequestUseCase: ApproveEventRequestUseCase = new ApproveEventRequestUseCase(repository);
  const rejectEventRequestUseCase: RejectEventRequestUseCase = new RejectEventRequestUseCase(repository);
  const getEventRequestDetailsUseCase: GetEventRequestDetailsUseCase = new GetEventRequestDetailsUseCase(repository);
  return new EventRequestController(
    getEventRequestsUseCase,
    approveEventRequestUseCase,
    rejectEventRequestUseCase,
    getEventRequestDetailsUseCase
  );
}