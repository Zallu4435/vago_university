import { InboxMessageModel } from '../../../infrastructure/database/mongoose/models/communication.model';

interface GetInboxMessagesParams {
  page: number;
  limit: number;
  search: string;
  status: string;
  from: string;
  userId: string;
  collection: 'register' | 'admin' | 'user' | 'faculty';
}

interface GetInboxMessagesResponse {
  messages: any[];
  total: number;
  page: number;
  limit: number;
}

class GetInboxMessages {
  async execute({
    page,
    limit,
    search,
    status,
    from,
    userId,
    collection,
  }: GetInboxMessagesParams): Promise<GetInboxMessagesResponse> {
    try {
        
      if (collection === 'register') {
        throw new Error('Users in register collection cannot access inbox messages');
      }

      const query: any = { isArchived: false, recipientId: userId };
      if (status !== 'all') query.status = status;
      if (from) query.from = { $regex: from, $options: 'i' };
      if (search) {
        query.$or = [
          { subject: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ];
      }

      const total = await InboxMessageModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count inbox messages: ${err.message}`);
      });
      const skip = (page - 1) * limit;

      const messages = await InboxMessageModel.find(query)
        .select('id from email subject date time status content thread')
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query inbox messages: ${err.message}`);
        });

      return {
        messages,
        total,
        page,
        limit,
      };
    } catch (err) {
      console.error(`Error in getInboxMessages use case:`, err);
      throw err;
    }
  }
}

export const getInboxMessages = new GetInboxMessages();