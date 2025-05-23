import { EventRequestModel } from '../../../infrastructure/database/mongoose/models/events.model';

interface GetEventRequestsParams {
  page: number;
  limit: number;
  type: string;
  status: string;
  organizer: string;
}

interface GetEventRequestsResponse {
  eventRequests: any[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

class GetEventRequests {
  async execute({
    page,
    limit,
    type,
    status,
    organizer,
  }: GetEventRequestsParams): Promise<GetEventRequestsResponse> {
    try {
      console.log(`Executing getEventRequests use case with params:`, {
        page,
        limit,
        type,
        status,
        organizer,
      });

      const query: any = {};
      if (type !== 'all') query.type = type;
      if (status !== 'all') query.status = status;
      if (organizer !== 'all') query.requestedBy = organizer;

      const totalItems = await EventRequestModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count event requests: ${err.message}`);
      });
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      const eventRequests = await EventRequestModel.find(query)
        .select('eventName requestedBy requesterType type proposedDate proposedVenue status requestedAt description expectedParticipants rejectionReason')
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query event requests: ${err.message}`);
        });

      return {
        eventRequests,
        totalItems,
        totalPages,
        currentPage: page,
      };
    } catch (err) {
      console.error(`Error in getEventRequests use case:`, err);
      throw err;
    }
  }
}

export const getEventRequests = new GetEventRequests();