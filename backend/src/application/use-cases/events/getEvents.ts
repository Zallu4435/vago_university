import { CampusEventModel } from '../../../infrastructure/database/mongoose/models/events.model';

interface GetEventsParams {
  page: number;
  limit: number;
  type: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
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
    type,
    status,
    startDate,
    endDate,
  }: GetEventsParams): Promise<GetEventsResponse> {
    try {
      console.log(`Executing getEvents use case with params:`, {
        page,
        limit,
        type,
        status,
        startDate,
        endDate,
      });

      const query: any = {};
      if (type !== 'all') query.eventType = type; // Using eventType as per previous update
      if (status !== 'all') query.status = status;

      // Add date range filter if startDate or endDate is provided
      if (startDate || endDate) {
        query.date = {};
        if (startDate) {
          // Convert startDate to YYYY-MM-DD format
          query.date.$gte = startDate.toISOString().split('T')[0];
        }
        if (endDate) {
          // Convert endDate to YYYY-MM-DD format
          query.date.$lte = endDate.toISOString().split('T')[0];
        }
      }

      const totalItems = await CampusEventModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count events: ${err.message}`);
      });
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      const events = await CampusEventModel.find(query)
        .select('title organizerType eventType date location status')
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