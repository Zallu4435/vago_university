import { NotificationProps } from "../../../domain/notifications/entities/NotificationTypes";
import {
    CreateNotificationResponseDTO,
    GetAllNotificationsResponseDTO,
    GetIndividualNotificationResponseDTO,
    DeleteNotificationResponseDTO,
    MarkNotificationAsReadResponseDTO,
    MarkAllNotificationsAsReadResponseDTO,
} from "../../../domain/notifications/dtos/NotificationResponseDTOs";

export interface INotificationRepository {
    createNotification(title: string, message: string, recipientType: string, recipientId: string, recipientName: string, createdBy: string, createdAt: Date, status: string, readBy: string[]): Promise<CreateNotificationResponseDTO>;
    getAllNotifications(recipientType: string, recipientId: string, page: number, limit: number, status: string, dateRange: string, search: string, isRead: boolean): Promise<GetAllNotificationsResponseDTO>;
    getIndividualNotification(notificationId: string): Promise<GetIndividualNotificationResponseDTO>;
    deleteNotification(notificationId: string): Promise<DeleteNotificationResponseDTO>;
    markNotificationAsRead(notificationId: string, recipientId: string): Promise<MarkNotificationAsReadResponseDTO>;
    markAllNotificationsAsRead(recipientType: string, recipientId: string): Promise<MarkAllNotificationsAsReadResponseDTO>;
    
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