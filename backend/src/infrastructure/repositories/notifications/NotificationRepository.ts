import { NotificationModel } from "../../database/mongoose/models/notification.model";
import { User as UserModel } from "../../database/mongoose/auth/user.model";
import { Faculty as FacultyModel } from "../../database/mongoose/auth/faculty.model";
import { INotificationRepository } from "../../../application/notifications/repositories/INotificationRepository";
import { NotificationFilter, NotificationProps, NotificationRecipientType } from "../../../domain/notifications/entities/NotificationTypes";
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

export class NotificationRepository implements INotificationRepository {
    async create(data: NotificationProps) {
        const notification = new NotificationModel({
            title: data.title,
            message: data.message,
            recipientType: data.recipientType,
            recipientId: data.recipientId,
            recipientName: data.recipientName,
            createdBy: data.createdBy,
            createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
            status: data.status,
            readBy: [],
        });

        return await notification.save();
    }

    async find(filter, options: { skip?: number; limit?: number; sort? } = {}) {
        // Add search support
        if (filter.search) {
            const searchRegex = new RegExp(filter.search, 'i');
            const searchFilter = {
                $or: [
                    { title: { $regex: searchRegex.source, $options: "i" } },
                    { message: { $regex: searchRegex.source, $options: "i" } }
                ]
            };
            delete filter.search;
            const result = await NotificationModel.find({ ...filter, ...searchFilter })
                .sort(options.sort ?? {})
                .skip(options.skip ?? 0)
                .limit(options.limit ?? 0)
                .lean();
            return result;
        }
        const result = await NotificationModel.find(filter)
            .sort(options.sort ?? {})
            .skip(options.skip ?? 0)
            .limit(options.limit ?? 0)
            .lean();
        return result;
    }

    async count(filter): Promise<number> {
        if (filter.search) {
            const searchRegex = new RegExp(filter.search, 'i');
            const searchFilter = {
                $or: [
                    { title: { $regex: searchRegex.source, $options: "i" } },
                    { message: { $regex: searchRegex.source, $options: "i" } }
                ]
            };
            delete filter.search;
            return NotificationModel.countDocuments({ ...filter, ...searchFilter });
        }
        return NotificationModel.countDocuments(filter);
    }

    async findById(id: string) {
        return NotificationModel.findById(id).lean();
    }

    async update(id: string, data: Partial<NotificationProps>) {
        return NotificationModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string) {
        await NotificationModel.findByIdAndDelete(id);
    }

    async findUsersByCollection(collection: string) {
        return UserModel.find().select("fcmTokens").lean();
    }

    async findFacultyByCollection(collection: string) {
        return FacultyModel.find().select("fcmTokens").lean();
    }

    async removeToken(token: string): Promise<void> {
        await UserModel.updateMany(
            { fcmTokens: token },
            { $pull: { fcmTokens: token } }
        );
        await FacultyModel.updateMany(
            { fcmTokens: token },
            { $pull: { fcmTokens: token } }
        );
    }

    async createNotification(params: CreateNotificationRequestDTO): Promise<CreateNotificationResponseDTO> {
        const notification = new NotificationModel({
            title: params.title,
            message: params.message,
            recipientType: params.recipientType,
            recipientId: params.recipientId,
            recipientName: params.recipientName,
            createdBy: params.createdBy,
            createdAt: new Date(),
            status: "sent",
            readBy: [],
        });

        await notification.save();
        return { notificationId: notification._id.toString() };
    }

    async getAllNotifications(params: GetAllNotificationsRequestDTO): Promise<GetAllNotificationsResponseDTO> {
        const { userId, collection, page = 1, limit = 10, recipientType, status, dateRange, isRead, search } = params;

        const query: NotificationFilter = {};

        if (userId && collection !== "admin") {
            const validRecipientTypes = ["all", "all_students_and_faculty"];
            
            if (collection === "user") {
                validRecipientTypes.push("all_students", "individual");
            } else if (collection === "faculty") {
                validRecipientTypes.push("all_faculty", "individual");
            }

            query.$or = [
                { recipientType: NotificationRecipientType.INDIVIDUAL, recipientId: userId },
                { recipientType: { $in: validRecipientTypes } },
            ];
        }

        if (isRead !== undefined && userId) {
            if (isRead) {
                query.readBy = userId;
            } else {
                query.readBy = { $ne: userId };
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

        let searchFilter = {};
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            searchFilter = {
                $or: [
                    { title: { $regex: searchRegex.source, $options: "i" } },
                    { message: { $regex: searchRegex.source, $options: "i" } }
                ]
            };
        }

        const notifications = await NotificationModel.find({ ...query, ...searchFilter })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        const totalItems = await NotificationModel.countDocuments({ ...query, ...searchFilter });
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

    async getIndividualNotification(params: GetIndividualNotificationRequestDTO): Promise<GetIndividualNotificationResponseDTO> {
        const notification = await NotificationModel.findById(params.notificationId).lean();
        if (!notification) {
            throw new Error("Notification not found");
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
                isRead: false, // This will be calculated in use case
                readBy: notification.readBy || [],
            },
        };
    }

    async deleteNotification(params: DeleteNotificationRequestDTO): Promise<DeleteNotificationResponseDTO> {
        const notification = await NotificationModel.findById(params.notificationId);
        if (!notification) {
            throw new Error("Notification not found");
        }

        await NotificationModel.findByIdAndDelete(params.notificationId);
        return { message: "Notification deleted successfully" };
    }

    async markNotificationAsRead(params: MarkNotificationAsReadRequestDTO): Promise<MarkNotificationAsReadResponseDTO> {
        const notification = await NotificationModel.findById(params.notificationId);
        if (!notification) {
            throw new Error("Notification not found");
        }

        if (!notification.readBy.includes(params.authenticatedUserId)) {
            notification.readBy.push(params.authenticatedUserId);
            await notification.save();
        }

        return { success: true, message: "Notification marked as read" };
    }

    async markAllNotificationsAsRead(params: MarkAllNotificationsAsReadRequestDTO): Promise<MarkAllNotificationsAsReadResponseDTO> {
        const { authenticatedUserId, collection } = params;

        const query: NotificationFilter = {};
        if (collection !== "admin") {
            const validRecipientTypes = ["all", "all_students_and_faculty"];
            
            if (collection === "user") {
                validRecipientTypes.push("all_students", "individual");
            } else if (collection === "faculty") {
                validRecipientTypes.push("all_faculty", "individual");
            }

            query.$or = [
                { recipientType: NotificationRecipientType.INDIVIDUAL, recipientId: authenticatedUserId },
                { recipientType: { $in: validRecipientTypes } },
            ];
        }

        const result = await NotificationModel.updateMany(
            { ...query, readBy: { $ne: authenticatedUserId } },
            { $push: { readBy: authenticatedUserId } }
        );

        return {
            success: true,
            message: "All notifications marked as read",
            updatedCount: result.modifiedCount,
        };
    }
}