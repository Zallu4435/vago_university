import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { getInboxMessages } from '../../application/use-cases/communication/getInboxMessages';
import { getSentMessages } from '../../application/use-cases/communication/getSentMessages';
import { sendMessage } from '../../application/use-cases/communication/sendMessage';
import { replyMessage } from '../../application/use-cases/communication/replyMessage';
import { deleteMessage } from '../../application/use-cases/communication/deleteMessage';
import { archiveMessage } from '../../application/use-cases/communication/archiveMessage';
import { markMessageAsRead } from '../../application/use-cases/communication/markMessageAsRead';

class CommunicationController {
  async getInboxMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = '1', limit = '10', search = '', status = 'all', from = '' } = req.query;

      console.log(`Received GET /api/admin/communication/inbox with filters:`, {
        page,
        limit,
        search,
        status,
        from,
      });

      if (isNaN(Number(page)) || isNaN(Number(limit)) || Number(page) < 1 || Number(limit) < 1) {
        return res.status(400).json({
          error: {
            message: 'Invalid page or limit parameters',
            code: 'INVALID_PARAMETERS',
            status: 400,
          },
        });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }

      const result = await getInboxMessages.execute({
        page: Number(page),
        limit: Number(limit),
        search: String(search),
        status: String(status),
        from: String(from),
        userId: req.user.id,
        collection: req.user.collection,
      });

      res.status(200).json({
        data: result.messages,
        total: result.total,
        page: result.page,
        limit: result.limit,
      });
    } catch (err: any) {
      console.error(`Error in getInboxMessages:`, err);
      res.status(500).json({
        error: {
          message: err.message,
          code: 'INTERNAL_SERVER_ERROR',
          status: 500,
        },
      });
    }
  }

  async getSentMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = '1', limit = '10', search = '', status = 'all', to = '' } = req.query;

      console.log(`Received GET /api/admin/communication/sent with filters:`, {
        page,
        limit,
        search,
        status,
        to,
      });

      if (isNaN(Number(page)) || isNaN(Number(limit)) || Number(page) < 1 || Number(limit) < 1) {
        return res.status(400).json({
          error: {
            message: 'Invalid page or limit parameters',
            code: 'INVALID_PARAMETERS',
            status: 400,
          },
        });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }

      const result = await getSentMessages.execute({
        page: Number(page),
        limit: Number(limit),
        search: String(search),
        status: String(status),
        to: String(to),
        userId: req.user.id,
        collection: req.user.collection,
      });

      res.status(200).json({
        data: result.messages,
        total: result.total,
        page: result.page,
        limit: result.limit,
      });
    } catch (err: any) {
      console.error(`Error in getSentMessages:`, err);
      res.status(500).json({
        error: {
          message: err.message,
          code: 'INTERNAL_SERVER_ERROR',
          status: 500,
        },
      });
    }
  }

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { to, subject, message } = req.body;
      const files = req.files as Express.Multer.File[];

      console.log(`Received POST /api/admin/communication/send with data:`, { to, subject, message, files: files?.length });

      if (!to || !subject || !message) {
        return res.status(400).json({
          error: {
            message: 'Missing required fields: to, subject, or message',
            code: 'MISSING_FIELDS',
            status: 400,
          },
        });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }

      // Handle `to` as either a JSON string or an object
      let recipients;
      try {
        recipients = typeof to === 'string' ? JSON.parse(to) : to;
      } catch (err) {
        console.error(`Error parsing 'to' field:`, err);
        return res.status(400).json({
          error: {
            message: 'Invalid format for "to" field; must be a valid JSON string or array',
            code: 'INVALID_TO_FORMAT',
            status: 400,
          },
        });
      }

      // Validate recipients array
      if (!Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({
          error: {
            message: '"to" must be a non-empty array of { value: string, label: string } objects',
            code: 'INVALID_TO_FORMAT',
            status: 400,
          },
        });
      }

      for (const recipient of recipients) {
        if (!recipient.value || !recipient.label || typeof recipient.value !== 'string' || typeof recipient.label !== 'string') {
          return res.status(400).json({
            error: {
              message: 'Each recipient must have a valid "value" and "label" as strings',
              code: 'INVALID_RECIPIENT',
              status: 400,
            },
          });
        }
      }

      const messageData = {
        to: recipients,
        subject,
        message,
        attachments: files,
        userId: req.user.id,
        collection: req.user.collection,
      };

      const sentMessage = await sendMessage.execute(messageData);

      res.status(201).json(sentMessage);
    } catch (err: any) {
      console.error(`Error in sendMessage:`, err);
      res.status(err.message.includes('Invalid file type') ? 400 : 500).json({
        error: {
          message: err.message,
          code: err.message.includes('Invalid file type') ? 'INVALID_FILE_TYPE' : 'INTERNAL_SERVER_ERROR',
          status: err.message.includes('Invalid file type') ? 400 : 500,
        },
      });
    }
  }

  async replyMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { messageId } = req.params;
      const { to, subject, message } = req.body;
      const files = req.files as Express.Multer.File[];

      console.log(`Received POST /api/admin/communication/reply/${messageId} with data:`, { to, subject, message, files: files?.length });

      if (!mongoose.isValidObjectId(messageId)) {
        return res.status(400).json({
          error: {
            message: 'Invalid message ID',
            code: 'INVALID_ID',
            status: 400,
          },
        });
      }

      if (!to || !subject || !message) {
        return res.status(400).json({
          error: {
            message: 'Missing required fields: to, subject, or message',
            code: 'MISSING_FIELDS',
            status: 400,
          },
        });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }

      const replyData = {
        messageId,
        to: JSON.parse(to),
        subject,
        message,
        attachments: files,
        userId: req.user.id,
        collection: req.user.collection,
      };

      const sentMessage = await replyMessage.execute(replyData);

      res.status(201).json(sentMessage);
    } catch (err: any) {
      console.error(`Error in replyMessage:`, err);
      res.status(err.message.includes('Invalid file type') ? 400 : 500).json({
        error: {
          message: err.message,
          code: err.message.includes('Invalid file type') ? 'INVALID_FILE_TYPE' : 'INTERNAL_SERVER_ERROR',
          status: err.message.includes('Invalid file type') ? 400 : 500,
        },
      });
    }
  }

  async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { messageId } = req.params;
      const { type } = req.query;

      console.log(`Received DELETE /api/admin/communication/messages/${messageId} with type:`, type);

      if (!mongoose.isValidObjectId(messageId)) {
        return res.status(400).json({
          error: {
            message: 'Invalid message ID',
            code: 'INVALID_ID',
            status: 400,
          },
        });
      }

      if (!type || !['inbox', 'sent'].includes(String(type))) {
        return res.status(400).json({
          error: {
            message: 'Missing or invalid "type" query parameter; must be "inbox" or "sent"',
            code: 'INVALID_MESSAGE_TYPE',
            status: 400,
          },
        });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }

      await deleteMessage.execute({
        messageId,
        messageType: String(type) as 'inbox' | 'sent',
        userId: req.user.id,
        collection: req.user.collection,
      });

      res.status(204).send();
    } catch (err: any) {
      console.error(`Error in deleteMessage:`, err);
      res.status(500).json({
        error: {
          message: err.message,
          code: 'INTERNAL_SERVER_ERROR',
          status: 500,
        },
      });
    }
  }

  async archiveMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { messageId } = req.params;

      console.log(`Received POST /api/admin/communication/archive/${messageId}`);

      if (!mongoose.isValidObjectId(messageId)) {
        return res.status(400).json({
          error: {
            message: 'Invalid message ID',
            code: 'INVALID_ID',
            status: 400,
          },
        });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }

      await archiveMessage.execute({ messageId, userId: req.user.id, collection: req.user.collection });

      res.status(204).send();
    } catch (err: any) {
      console.error(`Error in archiveMessage:`, err);
      res.status(500).json({
        error: {
          message: err.message,
          code: 'INTERNAL_SERVER_ERROR',
          status: 500,
        },
      });
    }
  }

  async markMessageAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { messageId } = req.params;

      console.log(`Received POST /api/admin/communication/read/${messageId}`);

      if (!mongoose.isValidObjectId(messageId)) {
        return res.status(400).json({
          error: {
            message: 'Invalid message ID',
            code: 'INVALID_ID',
            status: 400,
          },
        });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }

      await markMessageAsRead.execute({ messageId, userId: req.user.id, collection: req.user.collection });

      res.status(204).send();
    } catch (err: any) {
      console.error(`Error in markMessageAsRead:`, err);
      res.status(500).json({
        error: {
          message: err.message,
          code: 'INTERNAL_SERVER_ERROR',
          status: 500,
        },
      });
    }
  }
}

export const communicationController = new CommunicationController();