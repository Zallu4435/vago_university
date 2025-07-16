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
            status: NotificationStatus.PENDING,
        });

        try {
            // First save to database to get an ID
            const dbResult = await this.notificationRepository.create(notification.props);
            const notificationId = dbResult._id.toString();

            // Then send FCM notification with the ID
            try {
                await this.sendFCMNotification({
                    ...params,
                    id: notificationId
                });

                // Update status to sent
                await this.notificationRepository.update(notificationId, { status: NotificationStatus.SENT });
            } catch (error) {
                // If FCM fails, update status to failed
                await this.notificationRepository.update(notificationId, { status: NotificationStatus.FAILED });
                throw error;
            }

            return { notificationId };
        } catch (error) {
            throw new NotificationCreationFailedError(error.message);
        }
    }

    private async sendFCMNotification(params: CreateNotificationRequestDTO & { id: string }): Promise<void> {
        console.log('[Backend] Starting to send FCM notification:', {
            title: params.title,
            recipientType: params.recipientType,
            hasRecipientId: !!params.recipientId
        });

        const { title, message, recipientType, recipientId, id } = params;
        const fcmMessage = {
            notification: { title, body: message },
            data: { notificationId: id.toString() }
        };

        console.log('[Backend] Constructed FCM message:', fcmMessage);

        if (recipientType === NotificationRecipientType.INDIVIDUAL && recipientId) {
            console.log('[Backend] Sending individual notification to token:', recipientId);
            try {
                const result = await getMessaging().send({ ...fcmMessage, token: recipientId });
                console.log('[Backend] Individual notification sent successfully:', result);
            } catch (error) {
                console.error('[Backend] Failed to send individual notification:', error);
                // If token is invalid, remove it from the user's tokens
                if (error.code === 'messaging/invalid-registration-token' ||
                    error.code === 'messaging/registration-token-not-registered') {
                    await this.notificationRepository.removeToken(recipientId);
                }
                throw error;
            }
        } else {
            console.log('[Backend] Preparing to send bulk notifications');
            let students: any[] = [];
            let faculty: any[] = [];

            if ([NotificationRecipientType.ALL_STUDENTS, NotificationRecipientType.ALL, NotificationRecipientType.ALL_STUDENTS_AND_FACULTY].includes(recipientType)) {
                console.log('[Backend] Fetching student tokens');
                students = await this.notificationRepository.findUsersByCollection("user");
                console.log('[Backend] Found students:', students.length);
            }
            if ([NotificationRecipientType.ALL_FACULTY, NotificationRecipientType.ALL, NotificationRecipientType.ALL_STUDENTS_AND_FACULTY].includes(recipientType)) {
                console.log('[Backend] Fetching faculty tokens');
                faculty = await this.notificationRepository.findFacultyByCollection("faculty");
                console.log('[Backend] Found faculty:', faculty.length);
            }

            const studentTokens = students.flatMap((user) => user.fcmTokens || []);
            const facultyTokens = faculty.flatMap((faculty) => faculty.fcmTokens || []);
            const tokens = [...new Set([...studentTokens, ...facultyTokens])];

            console.log('[Backend] Total unique FCM tokens:', tokens.length);

            if (tokens.length === 0) {
                console.error('[Backend] No FCM tokens found for bulk send');
                throw new Error("No FCM tokens found");
            }

            // Send in batches
            const batchSize = 500;
            const batches = [];
            for (let i = 0; i < tokens.length; i += batchSize) {
                batches.push(tokens.slice(i, i + batchSize));
            }

            console.log('[Backend] Sending notifications in', batches.length, 'batches');

            try {
                const results = await Promise.all(
                    batches.map(async (batch, index) => {
                        console.log('[Backend] Sending batch', index + 1, 'of', batches.length);
                        const result = await getMessaging().sendEachForMulticast({
                            notification: { title, body: message },
                            data: { notificationId: params.id },
                            tokens: batch,
                        });

                        // Log detailed errors and clean up invalid tokens
                        result.responses.forEach(async (response, idx) => {
                            if (!response.success) {
                                console.error('[Backend] Token error:', {
                                    token: batch[idx].substring(0, 10) + '...',
                                    error: response.error.code,
                                    errorMessage: response.error.message
                                });

                                // Remove invalid tokens
                                if (response.error.code === 'messaging/invalid-registration-token' ||
                                    response.error.code === 'messaging/registration-token-not-registered') {
                                    const token = batch[idx];
                                    await this.notificationRepository.removeToken(token);
                                }
                            }
                        });

                        console.log('[Backend] Batch', index + 1, 'result:', {
                            successCount: result.successCount,
                            failureCount: result.failureCount,
                            errors: result.responses
                                .filter(r => !r.success)
                                .map(r => ({
                                    code: r.error.code,
                                    message: r.error.message
                                }))
                        });
                        return result;
                    })
                );
                console.log('[Backend] All notification batches sent successfully:', results);
            } catch (error) {
                console.error('[Backend] Error sending notification batches:', error);
                throw error;
            }
        }
    }
}

export class GetAllNotificationsUseCase implements IGetAllNotificationsUseCase {
    constructor(private notificationRepository: INotificationRepository) { }

    async execute(params: GetAllNotificationsRequestDTO): Promise<GetAllNotificationsResponseDTO> {
        const { userId, collection, page = 1, limit = 10, recipientType, status, dateRange, isRead, search } = params;

        // Debug log for incoming filter params
        console.log('[Notification] Incoming filter params:', {
            page, limit, recipientType, status, dateRange, search
        });

        // Build query/filter logic here (business logic)
        const filter: any = {};

        // Build query based on user's collection and what notifications they should see
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

        // Add isRead filter if provided
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
            console.log('[Notification] dateRange start:', start, 'end:', end);
            const startDate = new Date(start);
            const endDate = new Date(end);
            if (start && end && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                filter.createdAt = { $gte: startDate, $lte: endDate };
            } else {
                console.warn('[Notification] Invalid dateRange, skipping createdAt filter:', { start, end });
            }
        }

        // Add search support
        if (search) {
            filter.search = search;
        }

        // Debug log for final filter object
        console.log('[Notification] MongoDB filter:', filter);

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