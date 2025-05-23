import { SentMessageModel } from '../../../infrastructure/database/mongoose/models/communication.model';

interface GetSentMessagesParams {
  page: number;
  limit: number;
  search: string;
  status: string;
  to: string;
  userId: string;
  collection: 'register' | 'admin' | 'user' | 'faculty';
}

interface GetSentMessagesResponse {
  messages: any[];
  total: number;
  page: number;
  limit: number;
}

class GetSentMessages {
  async execute({
    page,
    limit,
    search,
    status,
    to,
    userId,
    collection,
  }: GetSentMessagesParams): Promise<GetSentMessagesResponse> {
    try {
      console.log(`Executing getSentMessages use case with params:`, {
        page,
        limit,
        search,
        status,
        to,
        userId,
        collection,
      });

      if (collection === 'register') {
        throw new Error('Users in register collection cannot access sent messages');
      }

      const query: any = { senderId: userId };
      if (status !== 'all') query.status = status;
      if (to) query.to = { $regex: to, $options: 'i' };
      if (search) {
        query.$or = [
          { subject: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ];
      }

      const total = await SentMessageModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count sent messages: ${err.message}`);
      });
      const skip = (page - 1) * limit;

      const messages = await SentMessageModel.find(query)
        .select('id to subject date time status content recipients attachments')
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query sent messages: ${err.message}`);
        });

      return {
        messages,
        total,
        page,
        limit,
      };
    } catch (err) {
      console.error(`Error in getSentMessages use case:`, err);
      throw err;
    }
  }
}

export const getSentMessages = new GetSentMessages();