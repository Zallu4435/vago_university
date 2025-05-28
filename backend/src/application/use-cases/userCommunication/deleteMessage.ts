import mongoose from 'mongoose';
import { MessageModel } from '../../../infrastructure/database/mongoose/models/communication.model';

interface DeleteMessageInput {
  messageId: string;
  userId: string;
}

interface DeleteMessageOutput {
  success: boolean;
  message: string;
}

class DeleteMessage {
  async execute({ messageId, userId }: DeleteMessageInput): Promise<DeleteMessageOutput> {
    try {
      console.log(`Executing deleteMessage for messageId: ${messageId}`);

      if (!mongoose.isValidObjectId(messageId) || !mongoose.isValidObjectId(userId)) {
        throw new Error('Invalid message or user ID');
      }

      const message = await MessageModel.findOne({
        _id: messageId,
        $or: [{ 'sender._id': userId }, { 'recipients._id': userId }],
      });

      if (!message) {
        throw new Error('Message not found or user is not authorized');
      }

      if (message.sender._id.toString() === userId || message.recipients.length === 1) {
        await MessageModel.deleteOne({ _id: messageId });
      } else {
        message.recipients = message.recipients.filter(r => r._id.toString() !== userId);
        await message.save();
      }

      return { success: true, message: 'Message deleted successfully' };
    } catch (err) {
      console.error(`Error in deleteMessage:`, err);
      throw err;
    }
  }
}

export const deleteMessage = new DeleteMessage();