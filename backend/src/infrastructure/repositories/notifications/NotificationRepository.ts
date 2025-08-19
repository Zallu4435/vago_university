import { NotificationModel } from "../../database/mongoose/notification/notification.model";
import { User as UserModel } from "../../database/mongoose/auth/user.model";
import { Faculty as FacultyModel } from "../../database/mongoose/auth/faculty.model";
import { INotificationRepository } from "../../../application/notifications/repositories/INotificationRepository";
import { NotificationFilter, NotificationProps, NotificationRecipientType } from "../../../domain/notifications/entities/NotificationTypes";

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

    async createNotification(title: string, message: string, recipientType: string, recipientId: string, recipientName: string, createdBy: string, createdAt: Date, status: string, readBy: string[]) {
        const notification = new NotificationModel({
            title: title,
            message: message,
            recipientType: recipientType,
            recipientId: recipientId,
            recipientName: recipientName,
            createdBy: createdBy,
            createdAt: new Date(),
            status: "sent",
            readBy: [],
        });

        await notification.save();
        return { notificationId: notification._id.toString() };
    }

    async getAllNotifications(recipientType: string, recipientId: string, page: number, limit: number, status: string, dateRange: string, search: string, isRead: boolean) {
        const query: NotificationFilter = {};

        if (recipientId && recipientType !== "admin") {
            const validRecipientTypes = ["all", "all_students_and_faculty"];
            
            if (recipientType === "user") {
                validRecipientTypes.push("all_students", "individual");
            } else if (recipientType === "faculty") {
                validRecipientTypes.push("all_faculty", "individual");
            }

            query.$or = [
                { recipientType: NotificationRecipientType.INDIVIDUAL, recipientId: recipientId },
                { recipientType: { $in: validRecipientTypes } },
            ];
        }

        if (isRead !== undefined && recipientId) {
            if (isRead) {
                query.readBy = recipientId;
            } else {
                query.readBy = { $ne: recipientId };
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
            isRead: n.readBy && n.readBy.includes(recipientId),
            readBy: n.readBy || [],
        }));

        return {
            notifications: notificationResponse,
            totalPages,
            currentPage: page,
            totalItems,
        };
    }

    async getIndividualNotification(notificationId: string) {
        const notification = await NotificationModel.findById(notificationId).lean();
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
                isRead: false, 
                readBy: notification.readBy || [],
            },
        };
    }

    async deleteNotification(notificationId: string) {
        const notification = await NotificationModel.findById(notificationId);
        if (!notification) {
            throw new Error("Notification not found");
        }

        await NotificationModel.findByIdAndDelete(notificationId);
        return { message: "Notification deleted successfully" };
    }

    async markNotificationAsRead(notificationId: string, recipientId: string) {
        const notification = await NotificationModel.findById(notificationId);
        if (!notification) {
            throw new Error("Notification not found");
        }

        if (!notification.readBy.includes(recipientId)) {
            notification.readBy.push(recipientId);
            await notification.save();
        }

        return { success: true, message: "Notification marked as read" };
    }

    async markAllNotificationsAsRead(recipientType: string, recipientId: string) {

        const query: NotificationFilter = {};
        if (recipientType !== "admin") {
            const validRecipientTypes = ["all", "all_students_and_faculty"];
            
            if (recipientType === "user") {
                validRecipientTypes.push("all_students", "individual");
            } else if (recipientType === "faculty") {
                validRecipientTypes.push("all_faculty", "individual");
            }

            query.$or = [
                { recipientType: NotificationRecipientType.INDIVIDUAL, recipientId: recipientId },
                { recipientType: { $in: validRecipientTypes } },
            ];
        }

        const result = await NotificationModel.updateMany(
            { ...query, readBy: { $ne: recipientId } },
            { $push: { readBy: recipientId } }
        );

        return {
            success: true,
            message: "All notifications marked as read",
            updatedCount: result.modifiedCount,
        };
    }
}