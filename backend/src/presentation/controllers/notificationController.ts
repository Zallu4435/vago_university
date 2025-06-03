import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { createNotification } from '../../application/use-cases/notification/createNotification';
import { getIndividualNotification } from '../../application/use-cases/notification/getNotification';
import { deleteNotification } from '../../application/use-cases/notification/deleteNotification';
import { NotificationModel } from '../../infrastructure/database/mongoose/models/notification.model';
import { getAllNotifications } from '../../application/use-cases/notification/getAllNotifications';

class NotificationController {
  async createNotification(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('createNotification: Request received:', {
        body: req.body,
        headers: req.headers,
      });

      const { title, message, recipientType, recipientId, recipientName } = req.body;
      
      if (!req.user) {
        console.error('createNotification: req.user is undefined');
        return res.status(401).json({ error: 'User authentication required' });
      }
      const { id: createdBy } = req.user;

      if (!title || !message || !recipientType) {
        console.error('createNotification: Missing required fields');
        return res.status(400).json({ error: 'title, message, and recipientType are required' });
      }

      const validRecipientTypes = ['individual', 'all_students', 'all_faculty', 'all', 'all_students_and_faculty'];
      if (!validRecipientTypes.includes(recipientType)) {
        console.error('createNotification: Invalid recipientType:', recipientType);
        return res.status(400).json({ error: 'Invalid recipientType' });
      }

      if (recipientType === 'individual' && (!recipientId || !mongoose.Types.ObjectId.isValid(recipientId))) {
        console.error('createNotification: Invalid or missing recipientId');
        return res.status(400).json({ error: 'Valid recipientId is required for individual notifications' });
      }

      const notification = await createNotification.execute({
        title,
        message,
        recipientType,
        recipientId,
        recipientName,
        createdBy,
      });

      console.log('createNotification: Notification created:', notification);
      res.status(201).json({ notificationId: notification._id });
    } catch (err: any) {
      console.error('createNotification: Error:', err);
      res.status(400).json({ error: err.message || 'Failed to create notification' });
    }
  }

  async getAllNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('getAllNotifications: Request received:', {
        query: req.query,
        headers: req.headers,
      });

      if (!req.user) {
        console.error('getAllNotifications: req.user is undefined');
        return res.status(401).json({ error: 'User authentication required' });
      }

    //   if (req.user.collection !== 'admin') {
    //     console.error('getAllNotifications: Unauthorized access');
    //     return res.status(403).json({ error: 'Admin access required' });
    //   }

      const { page = '1', limit = '10', recipientType, status, dateRange } = req.query;

      const notifications = await getAllNotifications.execute(req.user.id, {
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        recipientType: recipientType as string,
        status: status as string,
        dateRange: dateRange as string,
      }, req.user.collection);

      console.log('getAllNotifications: Notifications fetched:', notifications);
      res.status(200).json(notifications);
    } catch (err: any) {
      console.error('getAllNotifications: Error:', err);
      res.status(400).json({ error: err.message || 'Failed to fetch notifications' });
    }
  }

  async getIndividualNotification(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('getUserNotifications: Request received:', {
        params: req.params,
        query: req.query,
        headers: req.headers,
      });

      const { notificationId } = req.params;

      if (!req.user) {
        console.error('getUserNotifications: req.user is undefined');
        return res.status(401).json({ error: 'User authentication required' });
      }

      if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        console.error('getUserNotifications: Invalid userId format:', notificationId);
        return res.status(400).json({ error: 'Invalid userId format' });
      }

      const notifications = await getIndividualNotification.execute(notificationId);

      console.log('getUserNotifications: Notifications fetched:', notifications);
      res.status(200).json(notifications);
    } catch (err: any) {
      console.error('getUserNotifications: Error:', err);
      res.status(400).json({ error: err.message || 'Failed to fetch notifications' });
    }
  }

  async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('deleteNotification: Request received:', {
        params: req.params,
        headers: req.headers,
      });

      const { notificationId } = req.params;
      if (!req.user) {
        console.error('deleteNotification: req.user is undefined');
        return res.status(401).json({ error: 'User authentication required' });
      }
      const { id: authenticatedUserId, collection } = req.user;

      if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        console.error('deleteNotification: Invalid notificationId format:', notificationId);
        return res.status(400).json({ error: 'Invalid notificationId format' });
      }

      const notification = await NotificationModel.findOne({
        _id: notificationId,
        ...(collection !== 'admin' ? { createdBy: authenticatedUserId } : {}),
      });
      if (!notification) {
        console.error('deleteNotification: Notification not found or unauthorized');
        return res.status(403).json({ error: 'Notification not found or unauthorized' });
      }

      await deleteNotification.execute(notificationId);
      console.log('deleteNotification: Notification deleted:', notificationId);
      res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (err: any) {
      console.error('deleteNotification: Error:', err);
      res.status(400).json({ error: err.message || 'Failed to delete notification' });
    }
  }
}

export const notificationController = new NotificationController();