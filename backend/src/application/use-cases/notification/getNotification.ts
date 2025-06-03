import { NotificationModel } from "../../../infrastructure/database/mongoose/models/notification.model";

class GetIndividualNotification {
  async execute(
    notificationId: string | null,
  ) {
    const notifications = await NotificationModel.findById(notificationId)

    return {
      notifications
    };
  }
}

export const getIndividualNotification = new GetIndividualNotification();
