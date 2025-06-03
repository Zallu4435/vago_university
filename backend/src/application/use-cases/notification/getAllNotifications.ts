import mongoose from "mongoose";
import { NotificationModel } from "../../../infrastructure/database/mongoose/models/notification.model";

interface NotificationApiResponse {
  notifications: any[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

interface GetNotificationsOptions {
  page: number;
  limit: number;
  recipientType?: string;
  status?: string;
  dateRange?: string;
}

class GetAllNotifications {
  async execute(
    userId: string | null,
    options: GetNotificationsOptions,
    collection?: string
  ): Promise<NotificationApiResponse> {
    console.log(
      `Fetching notifications for userId: ${userId || "all"}, collection: ${
        collection || "none"
      }`,
      options
    );

    const { page = 1, limit = 10, recipientType, status, dateRange } = options;

    const query: any = {};

    if (userId && collection && collection !== "admin") {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userId");
      }

      // Determine valid recipient types based on collection
      const validRecipientTypes = ["all", "all_students_and_faculty"];
      if (collection === "user") {
        validRecipientTypes.push("all_students", "individual");
      } else if (collection === "faculty") {
        validRecipientTypes.push("all_faculty", "individual");
      }

      // Query for notifications relevant to the user
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
      .sort({ createdAt: -1 });

    const totalItems = await NotificationModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    console.log(`Fetched ${notifications.length} notifications`);
    return {
      notifications: notifications.map((n) => n.toObject()),
      totalPages,
      currentPage: page,
      totalItems,
    };
  }
}

export const getAllNotifications = new GetAllNotifications();
