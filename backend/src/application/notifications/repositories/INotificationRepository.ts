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
    // Original DTO-based methods (for backward compatibility)
    createNotification(params: CreateNotificationRequestDTO): Promise<CreateNotificationResponseDTO>;
    getAllNotifications(params: GetAllNotificationsRequestDTO): Promise<GetAllNotificationsResponseDTO>;
    getIndividualNotification(params: GetIndividualNotificationRequestDTO): Promise<GetIndividualNotificationResponseDTO>;
    deleteNotification(params: DeleteNotificationRequestDTO): Promise<DeleteNotificationResponseDTO>;
    markNotificationAsRead(params: MarkNotificationAsReadRequestDTO): Promise<MarkNotificationAsReadResponseDTO>;
    markAllNotificationsAsRead(params: MarkAllNotificationsAsReadRequestDTO): Promise<MarkAllNotificationsAsReadResponseDTO>;
    
    // New simple CRUD methods
    create(data: NotificationProps): Promise<any>;
    find(filter: any, options: { skip?: number; limit?: number; sort?: any }): Promise<any[]>;
    count(filter: any): Promise<number>;
    findById(id: string): Promise<any | null>;
    update(id: string, data: Partial<NotificationProps>): Promise<any | null>;
    delete(id: string): Promise<void>;
    
    // User-specific methods
    findUsersByCollection(collection: string): Promise<any[]>;
    findFacultyByCollection(collection: string): Promise<any[]>;
    removeToken(token: string): Promise<void>;
}