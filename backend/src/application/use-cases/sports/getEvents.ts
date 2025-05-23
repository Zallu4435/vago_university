import { EventModel } from '../../../infrastructure/database/mongoose/models/sports.model';

interface GetEventsParams {
  page: number;
  limit: number;
  sportType: string;
  status: string;
}

interface GetEventsResponse {
  events: any[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

class GetEvents {
  async execute({
    page,
    limit,
    sportType,
    status,
  }: GetEventsParams): Promise<GetEventsResponse> {
    try {
      console.log(`Executing getEvents use case with params:`, {
        page,
        limit,
        sportType,
        status,
      });

      const query: any = {};
      if (sportType !== 'all') query.sportType = sportType;
      if (status !== 'all') query.status = status;

      const totalItems = await EventModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count events: ${err.message}`);
      });
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      const events = await EventModel.find(query)
        .select('title sportType teams dateTime venue status')
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query events: ${err.message}`);
        });

      return {
        events,
        totalItems,
        totalPages,
        currentPage: page,
      };
    } catch (err) {
      console.error(`Error in getEvents use case:`, err);
      throw err;
    }
  }
}

export const getEvents = new GetEvents();