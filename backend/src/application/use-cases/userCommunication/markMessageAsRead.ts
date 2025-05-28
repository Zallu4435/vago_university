import mongoose from 'mongoose';
import { MessageModel } from '../../../infrastructure/database/mongoose/models/communication.model';

interface MarkMessageAsReadInput {
  messageId: string;
  userId: string;
}

interface MarkMessageAsReadOutput {
  success: boolean;
  message: string;
}

class MarkMessageAsRead {
  async execute({ messageId, userId }: MarkMessageAsReadInput): Promise<MarkMessageAsReadOutput> {
    try {
      console.log(`Executing markMessageAsRead for messageId: ${messageId}`);

      if (!mongoose.isValidObjectId(messageId) || !mongoose.isValidObjectId(userId)) {
        throw new Error('Invalid message or user ID');
      }

      const message = await MessageModel.findOne({
        _id: messageId,
        'recipients._id': userId,
      });

      if (!message) {
        throw new Error('Message not found or user is not a recipient');
      }

      const recipient = message.recipients.find(r => r._id.toString() === userId);
      if (!recipient) {
        throw new Error('Recipient not found in message');
      }

      if (recipient.status === 'read') {
        return { success: true, message: 'Message already marked as read' };
      }

      recipient.status = 'read';
      await message.save();

      return { success: true, message: 'Message marked as read' };
    } catch (err) {
      console.error(`Error in markMessageAsRead:`, err);
      throw err;
    }
  }
}

export const markMessageAsRead = new MarkMessageAsRead();