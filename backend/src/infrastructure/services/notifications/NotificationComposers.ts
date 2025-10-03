import { INotificationRepository } from '../../../application/notifications/repositories/INotificationRepository';
import {
  CreateNotificationUseCase,
  GetAllNotificationsUseCase,
  GetIndividualNotificationUseCase,
  DeleteNotificationUseCase,
  MarkNotificationAsReadUseCase,
  MarkAllNotificationsAsReadUseCase,
} from '../../../application/notifications/useCases/NotificationUseCases';
import {
  ICreateNotificationUseCase,
  IGetAllNotificationsUseCase,
  IGetIndividualNotificationUseCase,
  IDeleteNotificationUseCase,
  IMarkNotificationAsReadUseCase,
  IMarkAllNotificationsAsReadUseCase,
} from '../../../application/notifications/useCases/INotificationUseCases';
import { NotificationRepository } from '../../repositories/notifications/NotificationRepository';
import { NotificationController } from '../../../presentation/http/notifications/NotificationController';
import { INotificationController } from '../../../presentation/http/IHttp';

export function getNotificationComposer(): INotificationController {
  const repository: INotificationRepository = new NotificationRepository();
  const createNotificationUseCase: ICreateNotificationUseCase = new CreateNotificationUseCase(repository);
  const getAllNotificationsUseCase: IGetAllNotificationsUseCase = new GetAllNotificationsUseCase(repository);
  const getIndividualNotificationUseCase: IGetIndividualNotificationUseCase = new GetIndividualNotificationUseCase(repository);
  const deleteNotificationUseCase: IDeleteNotificationUseCase = new DeleteNotificationUseCase(repository);
  const markNotificationAsReadUseCase: IMarkNotificationAsReadUseCase = new MarkNotificationAsReadUseCase(repository);
  const markAllNotificationsAsReadUseCase: IMarkAllNotificationsAsReadUseCase = new MarkAllNotificationsAsReadUseCase(repository);
  return new NotificationController(
    createNotificationUseCase,
    getAllNotificationsUseCase,
    getIndividualNotificationUseCase,
    deleteNotificationUseCase,
    markNotificationAsReadUseCase,
    markAllNotificationsAsReadUseCase
  );
}