import {
    CreateNotificationRequestDTO,
    GetAllNotificationsRequestDTO,
    GetIndividualNotificationRequestDTO,
    DeleteNotificationRequestDTO,
} from "../../../domain/notifications/dtos/NotificationRequestDTOs";
import {
    CreateNotificationResponseDTO,
    GetAllNotificationsResponseDTO,
    GetIndividualNotificationResponseDTO,
    DeleteNotificationResponseDTO,
} from "../../../domain/notifications/dtos/NotificationResponseDTOs";

export interface INotificationRepository {
    createNotification(params: CreateNotificationRequestDTO): Promise<CreateNotificationResponseDTO>;
    getAllNotifications(params: GetAllNotificationsRequestDTO): Promise<GetAllNotificationsResponseDTO>;
    getIndividualNotification(params: GetIndividualNotificationRequestDTO): Promise<GetIndividualNotificationResponseDTO>;
    deleteNotification(params: DeleteNotificationRequestDTO): Promise<DeleteNotificationResponseDTO>;
}