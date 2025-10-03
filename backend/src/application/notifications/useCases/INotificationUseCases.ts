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

export interface ICreateNotificationUseCase {
    execute(params: CreateNotificationRequestDTO): Promise<CreateNotificationResponseDTO>;
}

export interface IGetAllNotificationsUseCase {
    execute(params: GetAllNotificationsRequestDTO): Promise<GetAllNotificationsResponseDTO>;
}

export interface IGetIndividualNotificationUseCase {
    execute(params: GetIndividualNotificationRequestDTO): Promise<GetIndividualNotificationResponseDTO>;
}

export interface IDeleteNotificationUseCase {
    execute(params: DeleteNotificationRequestDTO): Promise<DeleteNotificationResponseDTO>;
}

export interface IMarkNotificationAsReadUseCase {
    execute(params: MarkNotificationAsReadRequestDTO): Promise<MarkNotificationAsReadResponseDTO>;
}

export interface IMarkAllNotificationsAsReadUseCase {
    execute(params: MarkAllNotificationsAsReadRequestDTO): Promise<MarkAllNotificationsAsReadResponseDTO>;
}
