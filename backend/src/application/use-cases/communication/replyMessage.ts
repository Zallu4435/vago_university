import { InboxMessageModel, SentMessageModel } from '../../../infrastructure/database/mongoose/models/communication.model';
import { v4 as uuidv4 } from 'uuid';

interface ReplyMessageParams {
  messageId: string;
  to: { value: string; label: string }[];
  subject: string;
  message: string;
  attachments: Express.Multer.File[];
  userId: string;
  collection: 'register' | 'admin' | 'user' | 'faculty';
}

class ReplyMessage {
  async execute({
    messageId,
    to,
    subject,
    message,
    attachments,
    userId,
    collection,
  }: ReplyMessageParams): Promise<any> {
    try {
      console.log(`Executing replyMessage use case with data:`, {
        messageId,
        to,
        subject,
        message,
        attachments: attachments?.length,
        userId,
        collection,
      });

      if (collection === 'register') {
        throw new Error('Users in register collection cannot reply to messages');
      }

      const originalMessage = await InboxMessageModel.findById(messageId).catch((err) => {
        throw new Error(`Failed to find original message: ${err.message}`);
      });

      if (!originalMessage) {
        throw new Error('Original message not found');
      }

      if (originalMessage.recipientId !== userId) {
        throw new Error('User is not authorized to reply to this message');
      }

      const now = new Date();
      const threadEntry = {
        id: uuidv4(),
        from: userId,
        content: message,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0],
      };

      await InboxMessageModel.findByIdAndUpdate(
        messageId,
        { $push: { thread: threadEntry } },
        { runValidators: true }
      ).catch((err) => {
        throw new Error(`Failed to update message thread: ${err.message}`);
      });

      const sentMessageData = {
        id: uuidv4(),
        to: to.map((t) => t.label).join(', '),
        subject,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0],
        status: 'delivered',
        content: message,
        recipients: to.length,
        senderId: userId,
        attachments: attachments.map((file: any) => ({
          public_id: file.public_id,
          secure_url: file.secure_url,
          filename: file.originalname,
          format: file.format,
          bytes: file.bytes,
        })),
      };

      const sentMessage = await SentMessageModel.create(sentMessageData).catch((err) => {
        throw new Error(`Failed to send reply: ${err.message}`);
      });

      return sentMessage.toObject();
    } catch (err) {
      console.error(`Error in replyMessage use case:`, err);
      throw err;
    }
  }
}

export const replyMessage = new ReplyMessage();