import { Request, Response, NextFunction } from 'express';
import { getInboxMessages } from '../../application/use-cases/userCommunication/getInboxMessages';
import { getSentMessages } from '../../application/use-cases/userCommunication/getSentMessages';
import { sendMessage } from '../../application/use-cases/userCommunication/sendMessage';
import { markMessageAsRead } from '../../application/use-cases/userCommunication/markMessageAsRead';
import { deleteMessage } from '../../application/use-cases/userCommunication/deleteMessage';
import { getMessageDetails } from '../../application/use-cases/userCommunication/getMessageDetails';
import { getAllAdmins } from '../../application/use-cases/userCommunication/getAllAdmins';
import { UserModel } from '../../infrastructure/database/mongoose/models/user.model';
import { emitWebSocketEvent } from '../../shared/utils/websocket';

export class CommunicationController {
  async getInboxMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = '1', limit = '10', search, status, from, startDate, endDate } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const result = await getInboxMessages.execute({
        userId,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        search: search as string,
        status: status as 'read' | 'unread',
        from: from as string,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  }

  async getSentMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = '1', limit = '10', search, status, to, startDate, endDate } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const result = await getSentMessages.execute({
        userId,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        search: search as string,
        status: status as 'read' | 'unread' | 'delivered' | 'opened',
        to: to as string,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  }

  async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { to, subject, message, attachments } = req.body;
      const senderId = req.user?.id;
      const senderRole = req.user?.collection;

      if (!senderId) {
        throw new Error('User not authenticated');
      }

      const newmessage = await sendMessage.execute({
        senderId,
        senderRole,
        to: to || [], // Array of { value: string, label: string }
        subject,
        message,
        attachments,
      });

      const recipientIds = newmessage.recipients.map((r) => r._id.toString());
      emitWebSocketEvent('new_message', newmessage, recipientIds);

      res.status(201).json({ data: newmessage });
    } catch (err) {
      next(err);
    }
  }

  async markMessageAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { messageId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      await markMessageAsRead.execute({ messageId, userId });

      emitWebSocketEvent('message_read', { messageId, readBy: userId }, userId);

      res.status(200).json({ success: true, message: 'Message marked as read' });
    } catch (err) {
      next(err);
    }
  }

  async deleteMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { messageId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      await deleteMessage.execute({ messageId, userId });

      emitWebSocketEvent('message_deleted', { messageId }, userId);

      res.status(200).json({ success: true, message: 'Message deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  async getMessageDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { messageId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const message = await getMessageDetails.execute({ messageId, userId });

      res.status(200).json({ data: message });
    } catch (err) {
      next(err);
    }
  }

  async getAllAdmins(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const admins = await getAllAdmins.execute();
      res.status(200).json({ data: admins });
    } catch (err) {
      next(err);
    }
  }

  async getUserGroups(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const groups = [
        { value: 'all-students', label: 'All Students' },
        { value: 'all-faculty', label: 'All Faculty' },
        { value: 'all-staff', label: 'All Staff' },
        { value: 'freshman', label: 'Freshman Students' },
        { value: 'sophomore', label: 'Sophomore Students' },
        { value: 'junior', label: 'Junior Students' },
        { value: 'senior', label: 'Senior Students' },
        { value: 'individual', label: 'Individual User' },
      ];
      res.status(200).json({ data: groups });
    } catch (err) {
      next(err);
    }
  }

  // Admin-specific methods (replacing commented-out methods)
  async getAllInboxMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = '1', limit = '10', search, status, from, to, startDate, endDate } = req.query;
      const userId = req.user?.id;

      if (!userId || req.user?.collection !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      const result = await getInboxMessages.execute({
        userId, // Admins can see their own inbox
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        search: search as string,
        status: status as 'read' | 'unread',
        from: from as string,
        to: to as string,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  }

  async getAllSentMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = '1', limit = '10', search, status, from, to, startDate, endDate } = req.query;
      const userId = req.user?.id;

      if (!userId || req.user?.collection !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      const result = await getSentMessages.execute({
        userId, // Admins can see their own sent messages
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        search: search as string,
        status: status as 'read' | 'unread' | 'delivered' | 'opened',
        from: from as string,
        to: to as string,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  }
}

export const communicationController = new CommunicationController();