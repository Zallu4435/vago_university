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
import { NotificationProps, NotificationStatus, NotificationRecipientType } from "../../../domain/notifications/entities/NotificationTypes";
import { Notification } from "../../../domain/notifications/entities/Notification";
import {
    NotificationNotFoundError,
    InvalidNotificationIdError,
    InvalidRecipientIdError,
    NotificationCreationFailedError,
    NotificationReplyFailedError,
} from "../../../domain/notifications/errors/NotificationErrors";

function toNotificationProps(raw: any): NotificationProps {
    return {
        id: raw._id?.toString() ?? raw.id,
        title: raw.title,
        message: raw.message,
        recipientType: raw.recipientType,
        recipientId: raw.recipientId,
        recipientName: raw.recipientName,
        createdBy: raw.createdBy,
        createdAt: raw.createdAt,
        status: raw.status,
    };
}

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
    constructor(private notificationRepository: INotificationRepository) { }

    async execute(params: CreateNotificationRequestDTO): Promise<CreateNotificationResponseDTO> {
        // Create notification entity with business logic
        const notification = Notification.create({
            ...params,
            status: NotificationStatus.SENT,
        });

        try {
            // Send FCM notification
            await this.sendFCMNotification(params);

            // Save to database
            const dbResult = await this.notificationRepository.create(notification.props);
            return { notificationId: dbResult._id.toString() };
        } catch (error) {
            // If FCM fails, save with failed status
            const failedNotification = Notification.create({
                ...params,
                status: NotificationStatus.FAILED,
            });
            
            const dbResult = await this.notificationRepository.create(failedNotification.props);
            throw new NotificationCreationFailedError(error.message);
        }
    }

    private async sendFCMNotification(params: CreateNotificationRequestDTO): Promise<void> {
        const { title, message, recipientType, recipientId } = params;
        const fcmMessage = { notification: { title, body: message } };

        if (recipientType === NotificationRecipientType.INDIVIDUAL && recipientId) {
            await getMessaging().send({ ...fcmMessage, token: recipientId });
        } else {
            let students: any[] = [];
            let faculty: any[] = [];

            if ([NotificationRecipientType.ALL_STUDENTS, NotificationRecipientType.ALL, NotificationRecipientType.ALL_STUDENTS_AND_FACULTY].includes(recipientType)) {
                students = await this.notificationRepository.findUsersByCollection("user");
            }
            if ([NotificationRecipientType.ALL_FACULTY, NotificationRecipientType.ALL, NotificationRecipientType.ALL_STUDENTS_AND_FACULTY].includes(recipientType)) {
                faculty = await this.notificationRepository.findFacultyByCollection("faculty");
            }

            const studentTokens = students.flatMap((user) => user.fcmTokens || []);
            const facultyTokens = faculty.flatMap((faculty) => faculty.fcmTokens || []);
            const tokens = [...new Set([...studentTokens, ...facultyTokens])];

            if (tokens.length === 0) {
                throw new Error("No FCM tokens found");
            }

            // Send in batches
            const batchSize = 500;
            const batches = [];
            for (let i = 0; i < tokens.length; i += batchSize) {
                batches.push(tokens.slice(i, i + batchSize));
            }

            await Promise.all(
                batches.map((batch) =>
                    getMessaging().sendEachForMulticast({
                        notification: { title, body: message },
                        tokens: batch,
                    })
                )
            );
        }
    }
}

export class GetAllNotificationsUseCase implements IGetAllNotificationsUseCase {
    constructor(private notificationRepository: INotificationRepository) { }

    async execute(params: GetAllNotificationsRequestDTO): Promise<GetAllNotificationsResponseDTO> {
        const { userId, collection, page = 1, limit = 10, recipientType, status, dateRange, isRead } = params;

        // Build query/filter logic here (business logic)
        const filter: any = {};

        // Build query based on user's collection and what notifications they should see
        if (userId && collection !== "admin") {
            const validRecipientTypes = [NotificationRecipientType.ALL, NotificationRecipientType.ALL_STUDENTS_AND_FACULTY];
            
            if (collection === "user") {
                validRecipientTypes.push(NotificationRecipientType.ALL_STUDENTS, NotificationRecipientType.INDIVIDUAL);
            } else if (collection === "faculty") {
                validRecipientTypes.push(NotificationRecipientType.ALL_FACULTY, NotificationRecipientType.INDIVIDUAL);
            }

            filter.$or = [
                { recipientType: NotificationRecipientType.INDIVIDUAL, recipientId: userId },
                { recipientType: { $in: validRecipientTypes } },
            ];
        }

        // Add isRead filter if provided
        if (isRead !== undefined && userId) {
            if (isRead) {
                filter.readBy = userId;
            } else {
                filter.readBy = { $ne: userId };
            }
        }

        if (recipientType && recipientType !== "All") {
            filter.recipientType = recipientType.toLowerCase();
        }

        if (status && status !== "All") {
            filter.status = status.toLowerCase();
        }

        if (dateRange && dateRange !== "All") {
            const [start, end] = dateRange.split(",");
            filter.createdAt = { $gte: new Date(start), $lte: new Date(end) };
        }

        const skip = (page - 1) * limit;
        const sort = { createdAt: -1 };
        
        const notifications = await this.notificationRepository.find(filter, { skip, limit, sort });
        const totalItems = await this.notificationRepository.count(filter);
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
    constructor(private notificationRepository: INotificationRepository) { }

    async execute(params: GetIndividualNotificationRequestDTO): Promise<GetIndividualNotificationResponseDTO> {
        if (!params.notificationId) {
            throw new InvalidNotificationIdError();
        }

        const notification = await this.notificationRepository.findById(params.notificationId);
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
                isRead: false, // This will be calculated based on context
                readBy: notification.readBy || [],
            },
        };
    }
}

export class DeleteNotificationUseCase implements IDeleteNotificationUseCase {
    constructor(private notificationRepository: INotificationRepository) { }

    async execute(params: DeleteNotificationRequestDTO): Promise<DeleteNotificationResponseDTO> {
        if (!params.notificationId) {
            throw new InvalidNotificationIdError();
        }

        // Check if notification exists
        const notification = await this.notificationRepository.findById(params.notificationId);
        if (!notification) {
            throw new NotificationNotFoundError(params.notificationId);
        }

        // Delete from database
        await this.notificationRepository.delete(params.notificationId);

        return { message: "Notification deleted successfully" };
    }
}

export class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadUseCase {
    constructor(private notificationRepository: INotificationRepository) { }

    async execute(params: MarkNotificationAsReadRequestDTO): Promise<MarkNotificationAsReadResponseDTO> {
        if (!params.notificationId) {
            throw new InvalidNotificationIdError();
        }

        // Get notification
        const notification = await this.notificationRepository.findById(params.notificationId);
        if (!notification) {
            throw new NotificationNotFoundError(params.notificationId);
        }

        // Update readBy array
        const updatedNotification = await this.notificationRepository.update(params.notificationId, {
            readBy: [...(notification.readBy || []), params.authenticatedUserId]
        });

        if (!updatedNotification) {
            throw new NotificationNotFoundError(params.notificationId);
        }

        return { success: true, message: "Notification marked as read" };
    }
}

export class MarkAllNotificationsAsReadUseCase implements IMarkAllNotificationsAsReadUseCase {
    constructor(private notificationRepository: INotificationRepository) { }

    async execute(params: MarkAllNotificationsAsReadRequestDTO): Promise<MarkAllNotificationsAsReadResponseDTO> {
        const { authenticatedUserId, collection } = params;

        // Build query for notifications that should be marked as read
        const filter: any = {};
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

        // Add filter for notifications not yet read by this user
        filter.readBy = { $ne: authenticatedUserId };

        // Get count before update
        const countBefore = await this.notificationRepository.count(filter);

        // Update all matching notifications
        const notifications = await this.notificationRepository.find(filter);
        for (const notification of notifications) {
            await this.notificationRepository.update(notification._id.toString(), {
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