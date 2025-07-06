import mongoose from "mongoose";
import { getMessaging } from "firebase-admin/messaging";
import '../../../config/firebase-admin'; 
import { NotificationModel } from "../../database/mongoose/models/notification.model";
import { User as UserModel } from "../../database/mongoose/models/user.model";
import { Faculty as FacultyModel } from "../../database/mongoose/models/faculty.model";
import { NotificationErrorType } from "../../../domain/notifications/enums/NotificationErrorType";
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
    NotificationResponseDTO,
    MarkNotificationAsReadResponseDTO,
    MarkAllNotificationsAsReadResponseDTO,
} from "../../../domain/notifications/dtos/NotificationResponseDTOs";
import { INotificationRepository } from "../../../application/notifications/repositories/INotificationRepository";


export class NotificationRepository implements INotificationRepository {
    async createNotification(params: CreateNotificationRequestDTO): Promise<CreateNotificationResponseDTO> {
        const { title, message, recipientType, recipientId, recipientName, createdBy } = params;

        try {
            const fcmMessage = {
                notification: { title, body: message },
            };

            let tokens: string[] = [];

            if (recipientType === "individual" && recipientId) {
                await getMessaging().send({ ...fcmMessage, token: recipientId });
            } else {
                let students = [];
                let faculty = [];

                if (["all_students", "all", "all_students_and_faculty"].includes(recipientType)) {
                    students = await UserModel.find().select("fcmTokens");
                }
                if (["all_faculty", "all", "all_students_and_faculty"].includes(recipientType)) {
                    faculty = await FacultyModel.find().select("fcmTokens");
                }

                const studentTokens = students.flatMap((user) => user.fcmTokens || []);
                const facultyTokens = faculty.flatMap((faculty) => faculty.fcmTokens || []);
                tokens = [...new Set([...studentTokens, ...facultyTokens])];

                if (tokens.length === 0) {
                    throw new Error(NotificationErrorType.NoFCMTokensFound);
                }

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

            const notification = new NotificationModel({
                title,
                message,
                recipientType,
                recipientId,
                recipientName,
                createdBy,
                createdAt: new Date(),
                status: "sent",
                readBy: [],
            });

            await notification.save();

            return { notificationId: notification._id.toString() };
        } catch (error: any) {
            const notification = new NotificationModel({
                title,
                message,
                recipientType,
                recipientId,
                recipientName,
                createdBy,
                createdAt: new Date(),
                status: "failed",
                readBy: [],
            });
            await notification.save();
            throw new Error(error.message || NotificationErrorType.MissingRequiredFields);
        }
    }

    async getAllNotifications(params: GetAllNotificationsRequestDTO): Promise<GetAllNotificationsResponseDTO> {
        const { userId, collection, page = 1, limit = 10, recipientType, status, dateRange, isRead } = params;

        const query: any = {};

        // Build query based on user's collection and what notifications they should see
        if (userId && collection !== "admin") {
            const validRecipientTypes = ["all", "all_students_and_faculty"];
            
            if (collection === "user") {
                validRecipientTypes.push("all_students", "individual");
            } else if (collection === "faculty") {
                validRecipientTypes.push("all_faculty", "individual");
            }

            // User should see notifications that are:
            // 1. Sent specifically to them (individual with their userId)
            // 2. Sent to their user type (all_students, all_faculty, etc.)
            query.$or = [
                { recipientType: "individual", recipientId: userId },
                { recipientType: { $in: validRecipientTypes } },
            ];
        }

        // Add isRead filter if provided - filter based on whether user is in readBy array
        if (isRead !== undefined && userId) {
            if (isRead) {
                query.readBy = userId; // User has read this notification
            } else {
                query.readBy = { $ne: userId }; // User has not read this notification
            }
        }

        if (recipientType && recipientType !== "All") {
            query.recipientType = recipientType.toLowerCase();
        }

        if (status && status !== "All") {
            query.status = status.toLowerCase();
        }

        if (dateRange && dateRange !== "All") {
            const [start, end] = dateRange.split(",");
            query.createdAt = { $gte: new Date(start), $lte: new Date(end) };
        }

        const notifications = await NotificationModel.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        const totalItems = await NotificationModel.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);

        const notificationResponse: NotificationResponseDTO[] = notifications.map((n) => ({
            _id: n._id.toString(),
            title: n.title,
            message: n.message,
            recipientType: n.recipientType,
            recipientId: n.recipientId,
            recipientName: n.recipientName,
            createdBy: n.createdBy,
            createdAt: typeof n.createdAt === 'string' ? n.createdAt : n.createdAt.toISOString(),
            status: n.status,
            isRead: n.readBy && n.readBy.includes(userId), // Check if current user is in readBy array
            readBy: n.readBy || [],
        }));

        return {
            notifications: notificationResponse,
            totalPages,
            currentPage: page,
            totalItems,
        };
    }

    async getIndividualNotification(params: GetIndividualNotificationRequestDTO): Promise<GetIndividualNotificationResponseDTO> {
        const notification = await NotificationModel.findById(params.notificationId).lean();
        if (!notification) {
            throw new Error(NotificationErrorType.NotificationNotFound);
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

    async deleteNotification(params: DeleteNotificationRequestDTO): Promise<DeleteNotificationResponseDTO> {
        const { notificationId, authenticatedUserId, collection } = params;

        const query: any = { _id: notificationId };
        if (collection !== "admin") {
            query.createdBy = authenticatedUserId;
        }

        const notification = await NotificationModel.findOne(query);
        if (!notification) {
            throw new Error(NotificationErrorType.UnauthorizedAccess);
        }

        await NotificationModel.deleteOne({ _id: notificationId });

        return { message: "Notification deleted successfully" };
    }

    async markNotificationAsRead(params: MarkNotificationAsReadRequestDTO): Promise<MarkNotificationAsReadResponseDTO> {
        const { notificationId, authenticatedUserId, collection } = params;

        // Build query to find notification that the user is authorized to mark as read
        const query: any = { _id: notificationId };
        
        if (collection !== "admin") {
            // For non-admin users, they can only mark notifications as read if:
            // 1. It's sent specifically to them (individual with their userId)
            // 2. It's sent to their user type (all_students, all_faculty, etc.)
            const validRecipientTypes = ["all", "all_students_and_faculty"];
            
            if (collection === "user") {
                validRecipientTypes.push("all_students", "individual");
            } else if (collection === "faculty") {
                validRecipientTypes.push("all_faculty", "individual");
            }

            query.$or = [
                { recipientType: "individual", recipientId: authenticatedUserId },
                { recipientType: { $in: validRecipientTypes } },
            ];
        }

        const notification = await NotificationModel.findOne(query);
        if (!notification) {
            throw new Error(NotificationErrorType.UnauthorizedAccess);
        }

        // Check if user has already read this notification
        if (notification.readBy && notification.readBy.includes(authenticatedUserId)) {
            return { success: true, message: "Notification already marked as read" };
        }

        // Add user to readBy array
        await NotificationModel.updateOne(
            { _id: notificationId },
            { $addToSet: { readBy: authenticatedUserId } } // $addToSet prevents duplicates
        );

        return { success: true, message: "Notification marked as read successfully" };
    }

    async markAllNotificationsAsRead(params: MarkAllNotificationsAsReadRequestDTO): Promise<MarkAllNotificationsAsReadResponseDTO> {
        const { authenticatedUserId, collection } = params;

        // Build query to find unread notifications that the user is authorized to mark as read
        const query: any = { 
            readBy: { $ne: authenticatedUserId } // Not already read by this user
        };
        
        if (collection !== "admin") {
            // For non-admin users, they can only mark notifications as read if:
            // 1. It's sent specifically to them (individual with their userId)
            // 2. It's sent to their user type (all_students, all_faculty, etc.)
            const validRecipientTypes = ["all", "all_students_and_faculty"];
            
            if (collection === "user") {
                validRecipientTypes.push("all_students", "individual");
            } else if (collection === "faculty") {
                validRecipientTypes.push("all_faculty", "individual");
            }

            query.$or = [
                { recipientType: "individual", recipientId: authenticatedUserId },
                { recipientType: { $in: validRecipientTypes } },
            ];
        }

        const result = await NotificationModel.updateMany(
            query,
            { $addToSet: { readBy: authenticatedUserId } } // Add user to readBy array
        );

        return { 
            success: true, 
            message: `${result.modifiedCount} notifications marked as read successfully`,
            updatedCount: result.modifiedCount
        };
    }
}