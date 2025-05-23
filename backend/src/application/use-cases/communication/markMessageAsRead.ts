import { InboxMessageModel } from '../../../infrastructure/database/mongoose/models/communication.model';

interface MarkMessageAsReadParams {
  messageId: string;
  userId: string;
  collection: 'register' | 'admin' | 'user' | 'faculty';
}

class MarkMessageAsRead {
  async execute({ messageId, userId, collection }: MarkMessageAsReadParams): Promise<void> {
    try {
      console.log(`Executing markMessageAsRead use case with messageId:`, messageId, `userId:`, userId, `collection:`, collection);

      if (collection === 'register') {
        throw new Error('Users in register collection cannot mark messages as read');
      }

      const message = await InboxMessageModel.findByIdAndUpdate(
        messageId,
        { status: 'read' },
        { runValidators: true }
      ).catch((err) => {
        throw new Error(`Failed to mark message as read: ${err.message}`);
      });

      if (!message) {
        throw new Error('Message not found');
      }

      if (message.recipientId !== userId) {
        throw new Error('User is not authorized to mark this message as read');
      }
    } catch (err) {
      console.error(`Error in markMessageAsRead use case:`, err);
      throw err;
    }
  }
}

export const markMessageAsRead = new MarkMessageAsRead();