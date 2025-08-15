import { NotificationProps } from "../../../domain/notifications/entities/NotificationTypes";
import {
    CreateNotificationRequestDTO,
    GetAllNotificationsRequestDTO,
    GetIndividualNotificationRequestDTO,
    DeleteNotificationRequestDTO,
    MarkNotificationAsReadRequestDTO,
    MarkAllNotificationsAsReadRequestDTO,
} from "../../../domain/notifications/dtos/NotificationRequestDTOs";
import {
    CreateNotificationResponseDTO,
    GetAllNotificationsResponseDTO,
    GetIndividualNotificationResponseDTO,
    DeleteNotificationResponseDTO,
    MarkNotificationAsReadResponseDTO,
    MarkAllNotificationsAsReadResponseDTO,
} from "../../../domain/notifications/dtos/NotificationResponseDTOs";

export interface INotificationRepository {
    createNotification(params: CreateNotificationRequestDTO): Promise<CreateNotificationResponseDTO>;
    getAllNotifications(params: GetAllNotificationsRequestDTO): Promise<GetAllNotificationsResponseDTO>;
    getIndividualNotification(params: GetIndividualNotificationRequestDTO): Promise<GetIndividualNotificationResponseDTO>;
    deleteNotification(params: DeleteNotificationRequestDTO): Promise<DeleteNotificationResponseDTO>;
    markNotificationAsRead(params: MarkNotificationAsReadRequestDTO): Promise<MarkNotificationAsReadResponseDTO>;
    markAllNotificationsAsRead(params: MarkAllNotificationsAsReadRequestDTO): Promise<MarkAllNotificationsAsReadResponseDTO>;
    
    create(data: NotificationProps);
    find(filter, options?: { skip?: number; limit?: number; sort? });
    count(filter);
    findById(id: string);
    update(id: string, data: Partial<NotificationProps>);
    delete(id: string): Promise<void>;
    
    findUsersByCollection(collection: string);
    findFacultyByCollection(collection: string);
    removeToken(token: string): Promise<void>;
}