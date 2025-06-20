import {
  ICreateNotificationUseCase,
  IGetAllNotificationsUseCase,
  IGetIndividualNotificationUseCase,
  IDeleteNotificationUseCase,
} from '../../../application/notifications/useCases/NotificationUseCases';
import {
  CreateNotificationRequestDTO,
  GetAllNotificationsRequestDTO,
  GetIndividualNotificationRequestDTO,
  DeleteNotificationRequestDTO,
} from '../../../domain/notifications/dtos/NotificationRequestDTOs';
import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, INotificationController } from '../IHttp';

export class NotificationController implements INotificationController {
  private httpErrors = new HttpErrors();
  private httpSuccess = new HttpSuccess();

  constructor(
    private createNotificationUseCase: ICreateNotificationUseCase,
    private getAllNotificationsUseCase: IGetAllNotificationsUseCase,
    private getIndividualNotificationUseCase: IGetIndividualNotificationUseCase,
    private deleteNotificationUseCase: IDeleteNotificationUseCase
  ) {}

  async createNotification(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { title, message, recipientType, recipientId, recipientName } = httpRequest.body;
      const createdBy = httpRequest.user?.id;
      if (!createdBy || !title || !message || !recipientType) return this.httpErrors.error_400();
      const dto: CreateNotificationRequestDTO = { title, message, recipientType, recipientId, recipientName, createdBy };
      const response = await this.createNotificationUseCase.execute(dto);
      if (!response.success) return this.httpErrors.error_400();
      return this.httpSuccess.success_201(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async getAllNotifications(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
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
      const response = await this.getAllNotificationsUseCase.execute(dto);
      if (!response.success) return this.httpErrors.error_400();
      return this.httpSuccess.success_200(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async getIndividualNotification(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { notificationId } = httpRequest.params || {};
      if (!notificationId) return this.httpErrors.error_400();
      const dto: GetIndividualNotificationRequestDTO = { notificationId };
      const response = await this.getIndividualNotificationUseCase.execute(dto);
      if (!response.success) return this.httpErrors.error_400();
      return this.httpSuccess.success_200(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async deleteNotification(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { notificationId } = httpRequest.params || {};
      const authenticatedUserId = httpRequest.user?.id;
      const collection = httpRequest.user?.collection;
      if (!notificationId || !authenticatedUserId || !collection) return this.httpErrors.error_401();
      const dto: DeleteNotificationRequestDTO = { notificationId, authenticatedUserId, collection };
      const response = await this.deleteNotificationUseCase.execute(dto);
      if (!response.success) return this.httpErrors.error_403();
      return this.httpSuccess.success_200(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }
}