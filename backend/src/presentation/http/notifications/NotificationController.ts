import {
  ICreateNotificationUseCase,
  IGetAllNotificationsUseCase,
  IGetIndividualNotificationUseCase,
  IDeleteNotificationUseCase,
  IMarkNotificationAsReadUseCase,
  IMarkAllNotificationsAsReadUseCase,
} from '../../../application/notifications/useCases/NotificationUseCases';
import {
  CreateNotificationRequestDTO,
  GetAllNotificationsRequestDTO,
  GetIndividualNotificationRequestDTO,
  DeleteNotificationRequestDTO,
  MarkNotificationAsReadRequestDTO,
  MarkAllNotificationsAsReadRequestDTO,
} from '../../../domain/notifications/dtos/NotificationRequestDTOs';
import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, INotificationController } from '../IHttp';

export class NotificationController implements INotificationController {
  private httpErrors = new HttpErrors();
  private httpSuccess = new HttpSuccess();

  constructor(
    private createNotificationUseCase: ICreateNotificationUseCase,
    private getAllNotificationsUseCase: IGetAllNotificationsUseCase,
    private getIndividualNotificationUseCase: IGetIndividualNotificationUseCase,
    private deleteNotificationUseCase: IDeleteNotificationUseCase,
    private markNotificationAsReadUseCase: IMarkNotificationAsReadUseCase,
    private markAllNotificationsAsReadUseCase: IMarkAllNotificationsAsReadUseCase
  ) { }

  async createNotification(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { title, message, recipientType, recipientId, recipientName } = httpRequest.body;
    const createdBy = httpRequest.user?.id;
    if (!createdBy || !title || !message || !recipientType) return this.httpErrors.error_400();
    const dto: CreateNotificationRequestDTO = { title, message, recipientType, recipientId, recipientName, createdBy };
    const data = await this.createNotificationUseCase.execute(dto);
    return this.httpSuccess.success_201(data);
  }

  async getAllNotifications(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { page = "1", limit = "10", recipientType, status, dateRange } = httpRequest.query || {};
    const userId = httpRequest.user?.id;
    const collection = httpRequest.user?.collection;
    if (!userId || !collection) return this.httpErrors.error_401();
    const dto: GetAllNotificationsRequestDTO = {
      userId,
      collection,
      page: Number(page),
      limit: Number(limit),
      recipientType,
      status,
      dateRange,
    };
    const data = await this.getAllNotificationsUseCase.execute(dto);
    return this.httpSuccess.success_200(data);
  }

  async getIndividualNotification(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { notificationId } = httpRequest.params || {};
    if (!notificationId) return this.httpErrors.error_400();
    const dto: GetIndividualNotificationRequestDTO = { notificationId };
    const data = await this.getIndividualNotificationUseCase.execute(dto);
    return this.httpSuccess.success_200(data);
  }

  async deleteNotification(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { notificationId } = httpRequest.params || {};
    const authenticatedUserId = httpRequest.user?.id;
    const collection = httpRequest.user?.collection;
    if (!notificationId || !authenticatedUserId || !collection) return this.httpErrors.error_401();
    const dto: DeleteNotificationRequestDTO = { notificationId, authenticatedUserId, collection };
    const data = await this.deleteNotificationUseCase.execute(dto);
    return this.httpSuccess.success_200(data);
  }

  async markNotificationAsRead(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { notificationId } = httpRequest.params || {};
    const authenticatedUserId = httpRequest.user?.id;
    const collection = httpRequest.user?.collection;
    if (!notificationId || !authenticatedUserId || !collection) return this.httpErrors.error_401();
    const dto: MarkNotificationAsReadRequestDTO = { notificationId, authenticatedUserId, collection };
    const data = await this.markNotificationAsReadUseCase.execute(dto);
    return this.httpSuccess.success_200(data);
  }

  async markAllNotificationsAsRead(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const authenticatedUserId = httpRequest.user?.id;
    const collection = httpRequest.user?.collection;
    if (!authenticatedUserId || !collection) return this.httpErrors.error_401();
    const dto: MarkAllNotificationsAsReadRequestDTO = { authenticatedUserId, collection };
    const data = await this.markAllNotificationsAsReadUseCase.execute(dto);
    return this.httpSuccess.success_200(data);
  }
}