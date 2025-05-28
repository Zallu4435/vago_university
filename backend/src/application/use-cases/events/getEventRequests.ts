import { EventRequestModel } from '../../../infrastructure/database/mongoose/models/events.model';

interface GetEventRequestsParams {
  page: number;
  limit: number;
  type: string;
  status: string;
  organizer: string;
}

interface SimplifiedEventRequest {
  eventName: string;
  requestedId: string;
  requestedBy: string;
  type: string;
  requestedDate: string;
  status: string;
  proposedDate: string;
}

interface GetEventRequestsResponse {
  eventRequests: SimplifiedEventRequest[];
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
      if (page < 1 || limit < 1) {
        throw new Error('Invalid pagination parameters.');
      }

      const query: any = {};
      if (type && type !== 'all') query.type = type;
      if (status && status !== 'all') query.status = status;
      if (organizer && organizer !== 'all') query.requestedBy = organizer;

      const totalItems = await EventRequestModel.countDocuments(query);
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      const rawRequests = await EventRequestModel.find(query)
        .populate('eventId', 'title eventType') // Assuming eventId is a reference to CampusEventModel
        .populate('userId', 'email') // Assuming requestedBy is a reference to User
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const eventRequests: SimplifiedEventRequest[] = rawRequests.map((req: any) => ({
        eventName: req.eventId?.title || 'Unknown Event',
        requestedId: req._id.toString(),
        requestedBy: req.userId?.email || 'Unknown User',
        type: req.type,
        proposedDate: req.createdAt,
        status: req.status,
        type: req.eventId?.eventType,
      }));

      return {
        eventRequests,
        totalItems,
        totalPages,
        currentPage: page,
      };
    } catch (err: any) {
      console.error(`Error in getEventRequests use case:`, err);
      throw new Error(err.message || 'Failed to fetch event requests.');
    }
  }
}

export const getEventRequests = new GetEventRequests();
