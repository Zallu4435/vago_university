import mongoose from 'mongoose';
import { MessageModel } from '../../../infrastructure/database/mongoose/models/communication.model';

interface GetInboxMessagesInput {
  userId: string;
  page: number;
  limit: number;
  search?: string;
  status?: 'read' | 'unread';
  from?: string;
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
}

interface GetInboxMessagesOutput {
  messages: Message[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

class GetInboxMessages {
  async execute({
    userId,
    page,
    limit,
    search,
    status,
    from,
    startDate,
    endDate,
  }: GetInboxMessagesInput): Promise<GetInboxMessagesOutput> {
    try {
      console.log(`Executing getInboxMessages for userId: ${userId}`);

      if (!mongoose.isValidObjectId(userId)) {
        throw new Error('Invalid user ID');
      }

      const query: any = { 'recipients._id': userId };
      if (search) {
        query.subject = { $regex: search, $options: 'i' };
      }
      if (status) {
        query['recipients.status'] = status;
      }
      if (from && mongoose.isValidObjectId(from)) {
        query['sender._id'] = from;
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

      return {
        messages,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (err) {
      console.error(`Error in getInboxMessages:`, err);
      throw err;
    }
  }
}

export const getInboxMessages = new GetInboxMessages();