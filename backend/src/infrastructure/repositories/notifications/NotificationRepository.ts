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
} from "../../../domain/notifications/dtos/NotificationRequestDTOs";
import {
    CreateNotificationResponseDTO,
    GetAllNotificationsResponseDTO,
    GetIndividualNotificationResponseDTO,
    DeleteNotificationResponseDTO,
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
                createdAt: new Date().toISOString(),
                status: "sent",
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
                createdAt: new Date().toISOString(),
                status: "failed",
            });
            await notification.save();
            throw new Error(error.message || NotificationErrorType.MissingRequiredFields);
        }
    }

    async getAllNotifications(params: GetAllNotificationsRequestDTO): Promise<GetAllNotificationsResponseDTO> {
        const { userId, collection, page = 1, limit = 10, recipientType, status, dateRange } = params;

        const query: any = {};

        if (userId && collection !== "admin") {
            const validRecipientTypes = ["all", "all_students_and_faculty"];
            if (collection === "user") {
                validRecipientTypes.push("all_students", "individual");
            } else if (collection === "faculty") {
                validRecipientTypes.push("all_faculty", "individual");
            }

            query.$or = [
                { recipientType: "individual", recipientId: userId },
                { recipientType: { $in: validRecipientTypes } },
            ];
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
            createdAt: n.createdAt,
            status: n.status,
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
                createdAt: notification.createdAt,
                status: notification.status,
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
}