import mongoose from 'mongoose';
import { MessageModel } from '../../../infrastructure/database/mongoose/models/communication.model';

interface GetSentMessagesInput {
  userId: string;
  page: number;
  limit: number;
  search?: string;
  status?: 'read' | 'unread' | 'delivered' | 'opened';
  to?: string;
  startDate?: string;
  endDate?: string;
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
  attachments?: any[];
}

interface GetSentMessagesOutput {
  messages: Message[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

class GetSentMessages {
  async execute({
    userId,
    page,
    limit,
    search,
    status,
    to,
    startDate,
    endDate,
  }: GetSentMessagesInput): Promise<GetSentMessagesOutput> {
    try {
      console.log(`Executing getSentMessages for userId: ${userId}`);

      if (!mongoose.isValidObjectId(userId)) {
        throw new Error('Invalid user ID');
      }

      const query: any = { 'sender._id': userId };
      if (search) {
        query.subject = { $regex: search, $options: 'i' };
      }
      if (status) {
        if (status === 'delivered') {
          query['recipients.status'] = 'unread';
        } else if (status === 'opened') {
          query['recipients.status'] = 'read';
        } else {
          query['recipients.status'] = status;
        }
      }
      if (to && mongoose.isValidObjectId(to)) {
        query['recipients._id'] = to;
      }
      if (startDate) {
        query.createdAt = { $gte: new Date(startDate) };
      }
      if (endDate) {
        query.createdAt = { ...query.createdAt, $lte: new Date(endDate) };
      }

      const total = await MessageModel.countDocuments(query);
      const messages = await MessageModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

      // Map messages to include derived status for sent messages
      const formattedMessages = messages.map((msg) => ({
        ...msg,
        status: msg.recipients.some((r) => r.status === 'read') ? 'opened' : 'delivered',
        to: msg.recipients.map((r) => r.email).join(', '),
        recipients: msg.recipients.length,
      }));

      return {
        messages: formattedMessages,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (err) {
      console.error(`Error in getSentMessages:`, err);
      throw err;
    }
  }
}

export const getSentMessages = new GetSentMessages();