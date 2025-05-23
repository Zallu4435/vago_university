import { InboxMessageModel, SentMessageModel } from '../../../infrastructure/database/mongoose/models/communication.model';
import { cloudinary } from '../../../config/cloudinary.config';

interface DeleteMessageParams {
  messageId: string;
  messageType: 'inbox' | 'sent';
  userId: string;
  collection: 'register' | 'admin' | 'user' | 'faculty';
}

class DeleteMessage {
  async execute({ messageId, messageType, userId, collection }: DeleteMessageParams): Promise<void> {
    try {
      console.log(`Executing deleteMessage use case with messageId:`, messageId, `messageType:`, messageType, `userId:`, userId, `collection:`, collection);

      if (collection === 'register') {
        throw new Error('Users in register collection cannot delete messages');
      }

      if (messageType === 'inbox') {
        const message = await InboxMessageModel.findByIdAndDelete(messageId).catch((err) => {
          throw new Error(`Failed to delete inbox message: ${err.message}`);
        });

        if (!message) {
          throw new Error('Inbox message not found');
        }

        // Non-admins must be the recipient
        if (collection !== 'admin' && message.recipientId !== userId) {
          throw new Error('User is not authorized to delete this inbox message');
        }
      } else if (messageType === 'sent') {
        const message = await SentMessageModel.findById(messageId).catch((err) => {
          throw new Error(`Failed to find sent message: ${err.message}`);
        });

        if (!message) {
          throw new Error('Sent message not found');
        }

        // Non-admins must be the sender
        if (collection !== 'admin' && message.senderId !== userId) {
          throw new Error('User is not authorized to delete this sent message');
        }

        // Delete Cloudinary attachments if enabled
        if (process.env.DELETE_CLOUDINARY_ATTACHMENTS === 'true' && message.attachments?.length > 0) {
          for (const attachment of message.attachments) {
            try {
              await cloudinary.uploader.destroy(attachment.public_id);
              console.log(`Deleted Cloudinary attachment:`, attachment.public_id);
            } catch (err: any) {
              console.error(`Failed to delete Cloudinary attachment ${attachment.public_id}:`, err);
              // Continue with deletion even if Cloudinary fails
            }
          }
        }

        // Delete the sent message
        await SentMessageModel.findByIdAndDelete(messageId).catch((err) => {
          throw new Error(`Failed to delete sent message: ${err.message}`);
        });
      } else {
        throw new Error('Invalid message type; must be "inbox" or "sent"');
      }
    } catch (err) {
      console.error(`Error in deleteMessage use case:`, err);
      throw err;
    }
  }
}

export const deleteMessage = new DeleteMessage();