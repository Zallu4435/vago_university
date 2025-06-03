import mongoose from 'mongoose';
import { NotificationModel } from '../../../infrastructure/database/mongoose/models/notification.model';

class DeleteNotification {
  async execute(notificationId: string): Promise<void> {
    console.log(`Deleting notification: ${notificationId}`);

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      throw new Error('Invalid notificationId');
    }

    const notification = await NotificationModel.findByIdAndDelete(notificationId);
    if (!notification) {
      console.log(`Notification not found: ${notificationId}`);
      throw new Error('Notification not found');
    }

    console.log(`Notification deleted: ${notificationId}`);
  }
}

export const deleteNotification = new DeleteNotification();