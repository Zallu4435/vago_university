import { CampusEventModel } from "../../../infrastructure/database/mongoose/models/events.model";

interface GetEventsParams {
  page: number;
  limit: number;
  search: string;
  status: 'upcoming' | 'past' | 'all';
}

interface GetEventsResponse {
  events: any[];
  total: number;
  page: number;
  limit: number;
}

class GetEvents {
  async execute({ page, limit, search, status }: GetEventsParams): Promise<GetEventsResponse> {
    try {
      console.log(`Executing getEvents use case with params:`, { page, limit, search, status });

      const query: any = {};
      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }
      if (status !== 'all') {
        const today = new Date().toISOString().split('T')[0];
        query.date = status === 'upcoming' ? { $gte: today } : { $lt: today };
      }

      const total = await CampusEventModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count events: ${err.message}`);
      });

      const skip = (page - 1) * limit;
      const events = await CampusEventModel.find(query)
        .select('id title date time location organizer timeframe icon color description fullTime additionalInfo requirements')
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch events: ${err.message}`);
        });

      return {
        events,
        total,
        page,
        limit,
      };
    } catch (err) {
      console.error(`Error in getEvents use case:`, err);
      throw err;
    }
  }
}

export const getEvents = new GetEvents();