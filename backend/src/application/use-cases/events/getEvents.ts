import { CampusEventModel } from '../../../infrastructure/database/mongoose/models/events.model';

interface GetEventsParams {
  page: number;
  limit: number;
  type: string;
  status: string;
  organizer: string;
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
    organizer,
  }: GetEventsParams): Promise<GetEventsResponse> {
    try {
      console.log(`Executing getEvents use case with params:`, {
        page,
        limit,
        type,
        status,
        organizer,
      });

      const query: any = {};
      if (type !== 'all') query.type = type;
      if (status !== 'all') query.status = status;
      if (organizer !== 'all') query.organizer = organizer;

      const totalItems = await CampusEventModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count events: ${err.message}`);
      });
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      const events = await CampusEventModel.find(query)
        .select('name organizer organizerType type date time venue status description maxParticipants registrationRequired participants createdAt')
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