import mongoose from 'mongoose';
import { MessageModel } from '../../../infrastructure/database/mongoose/models/communication.model';

interface GetMessageDetailsInput {
  messageId: string;
  userId: string;
}

interface Message {
  _id: string;
  subject: string;
  content: string;
  sender: { _id: string; name: string; email: string; role: string };
  recipients: Array<{ _id: string; name: string; email: string; role: string; status: string }>;
  isBroadcast: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GetMessageDetailsOutput extends Message {}

class GetMessageDetails {
  async execute({ messageId, userId }: GetMessageDetailsInput): Promise<GetMessageDetailsOutput> {
    try {
      console.log(`Executing getMessageDetails for messageId: ${messageId}`);

      if (!mongoose.isValidObjectId(messageId) || !mongoose.isValidObjectId(userId)) {
        throw new Error('Invalid message or user ID');
      }

      const message = await MessageModel.findOne({
        _id: messageId,
        $or: [{ 'sender._id': userId }, { 'recipients._id': userId }],
      }).lean();

      if (!message) {
        throw new Error('Message not found or user is not authorized');
      }

      return message;
    } catch (err) {
      console.error(`Error in getMessageDetails:`, err);
      throw err;
    }
  }
}

export const getMessageDetails = new GetMessageDetails();