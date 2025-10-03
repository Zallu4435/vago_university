import {
  ICreateNotificationUseCase,
  IGetAllNotificationsUseCase,
  IGetIndividualNotificationUseCase,
  IDeleteNotificationUseCase,
  IMarkNotificationAsReadUseCase,
  IMarkAllNotificationsAsReadUseCase,
} from '../../../application/notifications/useCases/INotificationUseCases';
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
  private _httpErrors = new HttpErrors();
  private _httpSuccess = new HttpSuccess();

  constructor(
    private _createNotificationUseCase: ICreateNotificationUseCase,
    private _getAllNotificationsUseCase: IGetAllNotificationsUseCase,
    private _getIndividualNotificationUseCase: IGetIndividualNotificationUseCase,
    private _deleteNotificationUseCase: IDeleteNotificationUseCase,
    private _markNotificationAsReadUseCase: IMarkNotificationAsReadUseCase,
    private _markAllNotificationsAsReadUseCase: IMarkAllNotificationsAsReadUseCase
  ) { }

  async createNotification(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { title, message, recipientType, recipientId, recipientName } = httpRequest.body;
    const createdBy = httpRequest.user?.userId;
    if (!createdBy || !title || !message || !recipientType) return this._httpErrors.error_400();
    const dto: CreateNotificationRequestDTO = { title, message, recipientType, recipientId, recipientName, createdBy };
    const data = await this._createNotificationUseCase.execute(dto);
    return this._httpSuccess.success_201(data);
  }

  async getAllNotifications(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { page = "1", limit = "10", recipientType, status, dateRange, search } = httpRequest.query || {};
    const userId = httpRequest.user?.userId;
    const collection = httpRequest.user?.collection;
    if (!userId || !collection) return this._httpErrors.error_401();
    const dto: GetAllNotificationsRequestDTO = {
      userId,
      collection,
      page: Number(page),
      limit: Number(limit),
      recipientType,
      status,
      dateRange,
      search,
    };
    const data = await this._getAllNotificationsUseCase.execute(dto);
    return this._httpSuccess.success_200(data);
  }

  async getIndividualNotification(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { notificationId } = httpRequest.params || {};
    if (!notificationId) return this._httpErrors.error_400();
    const dto: GetIndividualNotificationRequestDTO = { notificationId };
    const data = await this._getIndividualNotificationUseCase.execute(dto);
    return this._httpSuccess.success_200(data);
  }

  async deleteNotification(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { notificationId } = httpRequest.params || {};
    const authenticatedUserId = httpRequest.user?.userId;
    const collection = httpRequest.user?.collection;
    if (!notificationId || !authenticatedUserId || !collection) return this._httpErrors.error_401();
    const dto: DeleteNotificationRequestDTO = { notificationId, authenticatedUserId, collection };
    const data = await this._deleteNotificationUseCase.execute(dto);
    return this._httpSuccess.success_200(data);
  }

  async markNotificationAsRead(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { notificationId } = httpRequest.params || {};
    const authenticatedUserId = httpRequest.user?.userId;
    const collection = httpRequest.user?.collection;
    if (!notificationId || !authenticatedUserId || !collection) return this._httpErrors.error_401();
    const dto: MarkNotificationAsReadRequestDTO = { notificationId, authenticatedUserId, collection };
    const data = await this._markNotificationAsReadUseCase.execute(dto);
    return this._httpSuccess.success_200(data);
  }

  async markAllNotificationsAsRead(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const authenticatedUserId = httpRequest.user?.userId;
    const collection = httpRequest.user?.collection;
    if (!authenticatedUserId || !collection) return this._httpErrors.error_401();
    const dto: MarkAllNotificationsAsReadRequestDTO = { authenticatedUserId, collection };
    const data = await this._markAllNotificationsAsReadUseCase.execute(dto);
    return this._httpSuccess.success_200(data);
  }
}