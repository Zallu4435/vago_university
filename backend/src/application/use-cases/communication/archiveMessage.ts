import { InboxMessageModel } from '../../../infrastructure/database/mongoose/models/communication.model';

interface ArchiveMessageParams {
  messageId: string;
  userId: string;
  collection: 'register' | 'admin' | 'user' | 'faculty';
}

class ArchiveMessage {
  async execute({ messageId, userId, collection }: ArchiveMessageParams): Promise<void> {
    try {
      console.log(`Executing archiveMessage use case with messageId:`, messageId, `userId:`, userId, `collection:`, collection);

      if (collection === 'register') {
        throw new Error('Users in register collection cannot archive messages');
      }

      const message = await InboxMessageModel.findByIdAndUpdate(
        messageId,
        { isArchived: true },
        { runValidators: true }
      ).catch((err) => {
        throw new Error(`Failed to archive message: ${err.message}`);
      });

      if (!message) {
        throw new Error('Message not found');
      }

      if (message.recipientId !== userId) {
        throw new Error('User is not authorized to archive this message');
      }
    } catch (err) {
      console.error(`Error in archiveMessage use case:`, err);
      throw err;
    }
  }
}

export const archiveMessage = new ArchiveMessage();