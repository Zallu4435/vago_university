import { getMessaging } from "firebase-admin/messaging";
import '../../../config/firebase-admin';
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
import { INotificationRepository } from "../repositories/INotificationRepository";
import { NotificationStatus, NotificationRecipientType, NotificationFilter } from "../../../domain/notifications/entities/NotificationTypes";
import { Notification } from "../../../domain/notifications/entities/Notification";
import {
    NotificationNotFoundError,
    InvalidNotificationIdError,
    NotificationCreationFailedError,
} from "../../../domain/notifications/errors/NotificationErrors";


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

export class CreateNotificationUseCase implements ICreateNotificationUseCase {
    constructor(private _notificationRepository: INotificationRepository) { }

    async execute(params: CreateNotificationRequestDTO): Promise<CreateNotificationResponseDTO> {
        const notification = Notification.create({
            ...params,
            status: NotificationStatus.PENDING,
        });

        try {
            const dbResult = await this._notificationRepository.create(notification.props);
            const notificationId = dbResult._id.toString();

            try {
                await this.sendFCMNotification({
                    ...params,
                    id: notificationId
                });

                await this._notificationRepository.update(notificationId, { status: NotificationStatus.SENT });
            } catch (error) {
                await this._notificationRepository.update(notificationId, { status: NotificationStatus.FAILED });
                throw error;
            }

            return { notificationId };
        } catch (error) {
            throw new NotificationCreationFailedError(error.message);
        }
    }

    private async sendFCMNotification(params: CreateNotificationRequestDTO & { id: string }): Promise<void> {
        const { title, message, recipientType, recipientId, id } = params;
        const fcmMessage = {
            notification: { title, body: message },
            data: { notificationId: id.toString() }
        };

        if (recipientType === NotificationRecipientType.INDIVIDUAL && recipientId) {
            try {
                const result = await getMessaging().send({ ...fcmMessage, token: recipientId });
            } catch (error) {
                console.error('[Backend] Failed to send individual notification:', error);
                if (error.code === 'messaging/invalid-registration-token' ||
                    error.code === 'messaging/registration-token-not-registered') {
                    await this._notificationRepository.removeToken(recipientId);
                }
                throw error;
            }
        } else {
            let students = [];
            let faculty = [];

            if ([NotificationRecipientType.ALL_STUDENTS, NotificationRecipientType.ALL, NotificationRecipientType.ALL_STUDENTS_AND_FACULTY].includes(recipientType)) {
                students = await this._notificationRepository.findUsersByCollection("user");
            }
            if ([NotificationRecipientType.ALL_FACULTY, NotificationRecipientType.ALL, NotificationRecipientType.ALL_STUDENTS_AND_FACULTY].includes(recipientType)) {
                faculty = await this._notificationRepository.findFacultyByCollection("faculty");
            }

            const studentTokens = students.flatMap((user) => user.fcmTokens || []);
            const facultyTokens = faculty.flatMap((faculty) => faculty.fcmTokens || []);
            const tokens = [...new Set([...studentTokens, ...facultyTokens])];


            if (tokens.length === 0) {
                console.error('[Backend] No FCM tokens found for bulk send');
                throw new Error("No FCM tokens found");
            }

            const batchSize = 500;
            const batches = [];
            for (let i = 0; i < tokens.length; i += batchSize) {
                batches.push(tokens.slice(i, i + batchSize));
            }

            try {
                await Promise.all(
                    batches.map(async (batch) => {
                        const result = await getMessaging().sendEachForMulticast({
                            notification: { title, body: message },
                            data: { notificationId: params.id },
                            tokens: batch,
                        });

                        result.responses.forEach(async (response, idx) => {
                            if (!response.success) {
                                console.error('[Backend] Token error:', {
                                    token: batch[idx].substring(0, 10) + '...',
                                    error: response.error.code,
                                    errorMessage: response.error.message
                                });

                                if (response.error.code === 'messaging/invalid-registration-token' ||
                                    response.error.code === 'messaging/registration-token-not-registered') {
                                    const token = batch[idx];
                                    await this._notificationRepository.removeToken(token);
                                }
                            }
                        });
                        return result;
                    })
                );
            } catch (error) {
                console.error('[Backend] Error sending notification batches:', error);
                throw error;
            }
        }
    }
}

export class GetAllNotificationsUseCase implements IGetAllNotificationsUseCase {
    constructor(private _notificationRepository: INotificationRepository) { }

    async execute(params: GetAllNotificationsRequestDTO): Promise<GetAllNotificationsResponseDTO> {
        const { userId, collection, page = 1, limit = 10, recipientType, status, dateRange, isRead, search } = params;

        const filter: NotificationFilter = {};

        if (userId && collection !== "admin") {
            const validRecipientTypes = [
                'all',
                'all_students',
                'all_faculty',
                'all_students_and_faculty'
            ];
            filter.$or = [
                { recipientId: userId },
                { recipientType: { $in: validRecipientTypes } },
            ];
        }

        if (isRead !== undefined && userId) {
            if (isRead) {
                filter.readBy = userId;
            } else {
                filter.readBy = { $ne: userId };
            }
        }

        if (recipientType && recipientType !== "all") {
            filter.recipientType = recipientType;
        }

        if (status && status !== "All") {
            filter.status = status.toLowerCase();
        }

        if (dateRange && dateRange !== "All") {
            let start, end;
            if (["last_week", "last_month", "last_3_months", "last_6_months", "last_year"].includes(dateRange)) {
                const now = new Date();
                const startDate = new Date(now);
                switch (dateRange) {
                    case "last_week":
                        startDate.setDate(now.getDate() - 7);
                        break;
                    case "last_month":
                        startDate.setMonth(now.getMonth() - 1);
                        break;
                    case "last_3_months":
                        startDate.setMonth(now.getMonth() - 3);
                        break;
                    case "last_6_months":
                        startDate.setMonth(now.getMonth() - 6);
                        break;
                    case "last_year":
                        startDate.setFullYear(now.getFullYear() - 1);
                        break;
                }
                start = startDate.toISOString();
                end = now.toISOString();
            } else if (dateRange.includes(",")) {
                [start, end] = dateRange.split(",");
            }
            const startDate = new Date(start);
            const endDate = new Date(end);
            if (start && end && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                filter.createdAt = { $gte: startDate, $lte: endDate };
            } else {
                console.warn('[Notification] Invalid dateRange, skipping createdAt filter:', { start, end });
            }
        }

        if (search) {
            filter.search = search;
        }

        const skip = (page - 1) * limit;
        const sort = { createdAt: -1 };

        const notifications = await this._notificationRepository.find(filter, { skip, limit, sort });
        const totalItems = await this._notificationRepository.count(filter);
        const totalPages = Math.ceil(totalItems / limit);

        const notificationResponse = notifications.map((n) => ({
            _id: n._id.toString(),
            title: n.title,
            message: n.message,
            recipientType: n.recipientType,
            recipientId: n.recipientId,
            recipientName: n.recipientName,
            createdBy: n.createdBy,
            createdAt: typeof n.createdAt === 'string' ? n.createdAt : n.createdAt.toISOString(),
            status: n.status,
            isRead: n.readBy && n.readBy.includes(userId),
            readBy: n.readBy || [],
        }));

        return {
            notifications: notificationResponse,
            totalPages,
            currentPage: page,
            totalItems,
        };
    }
}

export class GetIndividualNotificationUseCase implements IGetIndividualNotificationUseCase {
    constructor(private _notificationRepository: INotificationRepository) { }

    async execute(params: GetIndividualNotificationRequestDTO): Promise<GetIndividualNotificationResponseDTO> {
        if (!params.notificationId) {
            throw new InvalidNotificationIdError();
        }

        const notification = await this._notificationRepository.findById(params.notificationId);
        if (!notification) {
            throw new NotificationNotFoundError(params.notificationId);
        }

        return {
            notification: {
                _id: notification._id.toString(),
                title: notification.title,
                message: notification.message,
                recipientType: notification.recipientType,
                recipientId: notification.recipientId,
                recipientName: notification.recipientName,
                createdBy: notification.createdBy,
                createdAt: typeof notification.createdAt === 'string' ? notification.createdAt : notification.createdAt.toISOString(),
                status: notification.status,
                isRead: false,
                readBy: notification.readBy || [],
            },
        };
    }
}

export class DeleteNotificationUseCase implements IDeleteNotificationUseCase {
    constructor(private _notificationRepository: INotificationRepository) { }

    async execute(params: DeleteNotificationRequestDTO): Promise<DeleteNotificationResponseDTO> {
        if (!params.notificationId) {
            throw new InvalidNotificationIdError();
        }

        const notification = await this._notificationRepository.findById(params.notificationId);
        if (!notification) {
            throw new NotificationNotFoundError(params.notificationId);
        }

        await this._notificationRepository.delete(params.notificationId);

        return { message: "Notification deleted successfully" };
    }
}

export class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadUseCase {
    constructor(private _notificationRepository: INotificationRepository) { }

    async execute(params: MarkNotificationAsReadRequestDTO): Promise<MarkNotificationAsReadResponseDTO> {
        if (!params.notificationId) {
            throw new InvalidNotificationIdError();
        }

        const notification = await this._notificationRepository.findById(params.notificationId);
        if (!notification) {
            throw new NotificationNotFoundError(params.notificationId);
        }

        const updatedNotification = await this._notificationRepository.update(params.notificationId, {
            readBy: [...(notification.readBy || []), params.authenticatedUserId]
        });

        if (!updatedNotification) {
            throw new NotificationNotFoundError(params.notificationId);
        }

        return { success: true, message: "Notification marked as read" };
    }
}

export class MarkAllNotificationsAsReadUseCase implements IMarkAllNotificationsAsReadUseCase {
    constructor(private _notificationRepository: INotificationRepository) { }

    async execute(params: MarkAllNotificationsAsReadRequestDTO): Promise<MarkAllNotificationsAsReadResponseDTO> {
        const { authenticatedUserId, collection } = params;

        const filter: NotificationFilter = {};
        if (collection !== "admin") {
            const validRecipientTypes = [NotificationRecipientType.ALL, NotificationRecipientType.ALL_STUDENTS_AND_FACULTY];

            if (collection === "user") {
                validRecipientTypes.push(NotificationRecipientType.ALL_STUDENTS, NotificationRecipientType.INDIVIDUAL);
            } else if (collection === "faculty") {
                validRecipientTypes.push(NotificationRecipientType.ALL_FACULTY, NotificationRecipientType.INDIVIDUAL);
            }

            filter.$or = [
                { recipientType: NotificationRecipientType.INDIVIDUAL, recipientId: authenticatedUserId },
                { recipientType: { $in: validRecipientTypes } },
            ];
        }

        filter.readBy = { $ne: authenticatedUserId };

        const countBefore = await this._notificationRepository.count(filter);

        const notifications = await this._notificationRepository.find(filter);
        for (const notification of notifications) {
            await this._notificationRepository.update(notification._id.toString(), {
                readBy: [...(notification.readBy || []), authenticatedUserId]
            });
        }

        return {
            success: true,
            message: "All notifications marked as read",
            updatedCount: countBefore,
        };
    }
}