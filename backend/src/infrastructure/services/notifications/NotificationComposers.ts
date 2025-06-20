import { INotificationRepository } from '../../../application/notifications/repositories/INotificationRepository';
import {
  CreateNotificationUseCase,
  GetAllNotificationsUseCase,
  GetIndividualNotificationUseCase,
  DeleteNotificationUseCase,
  ICreateNotificationUseCase,
  IGetAllNotificationsUseCase,
  IGetIndividualNotificationUseCase,
  IDeleteNotificationUseCase,
} from '../../../application/notifications/useCases/NotificationUseCases';
import { NotificationRepository } from '../../repositories/notifications/NotificationRepository';
import { NotificationController } from '../../../presentation/http/notifications/NotificationController';
import { INotificationController } from '../../../presentation/http/IHttp';

export function getNotificationComposer(): INotificationController {
  const repository: INotificationRepository = new NotificationRepository();
  const createNotificationUseCase: ICreateNotificationUseCase = new CreateNotificationUseCase(repository);
  const getAllNotificationsUseCase: IGetAllNotificationsUseCase = new GetAllNotificationsUseCase(repository);
  const getIndividualNotificationUseCase: IGetIndividualNotificationUseCase = new GetIndividualNotificationUseCase(repository);
  const deleteNotificationUseCase: IDeleteNotificationUseCase = new DeleteNotificationUseCase(repository);
  return new NotificationController(
    createNotificationUseCase,
    getAllNotificationsUseCase,
    getIndividualNotificationUseCase,
    deleteNotificationUseCase
  );
}