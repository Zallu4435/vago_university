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
import { NotificationErrorType } from "../../../domain/notifications/enums/NotificationErrorType";
import { INotificationRepository } from "../repositories/INotificationRepository";
import mongoose from "mongoose";

interface ResponseDTO<T> {
    data: T | { error: string };
    success: boolean;
}

export interface ICreateNotificationUseCase {
    execute(params: CreateNotificationRequestDTO): Promise<ResponseDTO<CreateNotificationResponseDTO>>;
}

export interface IGetAllNotificationsUseCase {
    execute(params: GetAllNotificationsRequestDTO): Promise<ResponseDTO<GetAllNotificationsResponseDTO>>;
}

export interface IGetIndividualNotificationUseCase {
    execute(params: GetIndividualNotificationRequestDTO): Promise<ResponseDTO<GetIndividualNotificationResponseDTO>>;
}

export interface IDeleteNotificationUseCase {
    execute(params: DeleteNotificationRequestDTO): Promise<ResponseDTO<DeleteNotificationResponseDTO>>;
}

export interface IMarkNotificationAsReadUseCase {
    execute(params: MarkNotificationAsReadRequestDTO): Promise<ResponseDTO<MarkNotificationAsReadResponseDTO>>;
}

export interface IMarkAllNotificationsAsReadUseCase {
    execute(params: MarkAllNotificationsAsReadRequestDTO): Promise<ResponseDTO<MarkAllNotificationsAsReadResponseDTO>>;
}

export class CreateNotificationUseCase implements ICreateNotificationUseCase {
    constructor(private notificationRepository: INotificationRepository) { }

    async execute(params: CreateNotificationRequestDTO): Promise<ResponseDTO<CreateNotificationResponseDTO>> {
        try {
            // console.log(`Executing createNotification use case with params:`, params);
            const result = await this.notificationRepository.createNotification(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("CreateNotificationUseCase: Error:", error);
            return { data: { error: error.message || NotificationErrorType.MissingRequiredFields }, success: false };
        }
    }
}

export class GetAllNotificationsUseCase implements IGetAllNotificationsUseCase {
    constructor(private notificationRepository: INotificationRepository) { }

    async execute(params: GetAllNotificationsRequestDTO): Promise<ResponseDTO<GetAllNotificationsResponseDTO>> {
        try {
            // console.log(`Executing getAllNotifications use case with params:`, params);
            if (params.userId && !mongoose.Types.ObjectId.isValid(params.userId)) {
                return { data: { error: NotificationErrorType.InvalidRecipientId }, success: false };
            }
            const result = await this.notificationRepository.getAllNotifications(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("GetAllNotificationsUseCase: Error:", error);
            return { data: { error: error.message || NotificationErrorType.NotificationNotFound }, success: false };
        }
    }
}

export class GetIndividualNotificationUseCase implements IGetIndividualNotificationUseCase {
    constructor(private notificationRepository: INotificationRepository) { }

    async execute(params: GetIndividualNotificationRequestDTO): Promise<ResponseDTO<GetIndividualNotificationResponseDTO>> {
        try {
            // console.log(`Executing getIndividualNotification use case with params:`, params);
            if (!mongoose.Types.ObjectId.isValid(params.notificationId)) {
                return { data: { error: NotificationErrorType.InvalidNotificationId }, success: false };
            }
            const result = await this.notificationRepository.getIndividualNotification(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("GetIndividualNotificationUseCase: Error:", error);
            return { data: { error: error.message || NotificationErrorType.NotificationNotFound }, success: false };
        }
    }
}

export class DeleteNotificationUseCase implements IDeleteNotificationUseCase {
    constructor(private notificationRepository: INotificationRepository) { }

    async execute(params: DeleteNotificationRequestDTO): Promise<ResponseDTO<DeleteNotificationResponseDTO>> {
        try {
            // console.log(`Executing deleteNotification use case with params:`, params);
            if (!mongoose.Types.ObjectId.isValid(params.notificationId)) {
                return { data: { error: NotificationErrorType.InvalidNotificationId }, success: false };
            }
            const result = await this.notificationRepository.deleteNotification(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("DeleteNotificationUseCase: Error:", error);
            return { data: { error: error.message || NotificationErrorType.NotificationNotFound }, success: false };
        }
    }
}

export class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadUseCase {
    constructor(private notificationRepository: INotificationRepository) { }

    async execute(params: MarkNotificationAsReadRequestDTO): Promise<ResponseDTO<MarkNotificationAsReadResponseDTO>> {
        try {
            // console.log(`Executing markNotificationAsRead use case with params:`, params);
            if (!mongoose.Types.ObjectId.isValid(params.notificationId)) {
                return { data: { error: NotificationErrorType.InvalidNotificationId }, success: false };
            }
            const result = await this.notificationRepository.markNotificationAsRead(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("MarkNotificationAsReadUseCase: Error:", error);
            return { data: { error: error.message || NotificationErrorType.NotificationNotFound }, success: false };
        }
    }
}

export class MarkAllNotificationsAsReadUseCase implements IMarkAllNotificationsAsReadUseCase {
    constructor(private notificationRepository: INotificationRepository) { }

    async execute(params: MarkAllNotificationsAsReadRequestDTO): Promise<ResponseDTO<MarkAllNotificationsAsReadResponseDTO>> {
        try {
            // console.log(`Executing markAllNotificationsAsRead use case with params:`, params);
            const result = await this.notificationRepository.markAllNotificationsAsRead(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("MarkAllNotificationsAsReadUseCase: Error:", error);
            return { data: { error: error.message || NotificationErrorType.NotificationNotFound }, success: false };
        }
    }
}