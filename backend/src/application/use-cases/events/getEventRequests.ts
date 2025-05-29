import {
  EventRequestModel,
  CampusEventModel,
} from "../../../infrastructure/database/mongoose/models/events.model";

interface GetEventRequestsParams {
  page: number;
  limit: number;
  type?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
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
    startDate,
    endDate,
  }: GetEventRequestsParams): Promise<GetEventRequestsResponse> {
    try {
      if (page < 1 || limit < 1) {
        throw new Error("Invalid pagination parameters.");
      }

      const query: any = {};
      if (status && status.toLowerCase() !== "all") {
        query.status = status;
      }

      const eventQuery: any = {};
      if (type && type.toLowerCase() !== "all") {
        eventQuery.eventType = type;
      }
      if (startDate || endDate) {
        eventQuery.date = {};
        if (startDate) {
          eventQuery.date.$gte = startDate.toISOString().split("T")[0];
        }
        if (endDate) {
          eventQuery.date.$lte = endDate.toISOString().split("T")[0];
        }
      }

      const matchingEvents = await CampusEventModel.find(eventQuery)
        .select("_id")
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query events: ${err.message}`);
        });

      const eventIds = matchingEvents.map((event) => event._id);
      if (
        eventIds.length === 0 &&
        ((type && type.toLowerCase() !== "all") || startDate || endDate)
      ) {
        return {
          eventRequests: [],
          totalItems: 0,
          totalPages: 0,
          currentPage: page,
        };
      }

      if (eventIds.length > 0) {
        query.eventId = { $in: eventIds };
      }

      const totalItems = await EventRequestModel.countDocuments(query).catch(
        (err) => {
          throw new Error(`Failed to count event requests: ${err.message}`);
        }
      );
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      const rawRequests = await EventRequestModel.find(query)
        .populate("eventId", "title eventType date")
        .populate("userId", "email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query event requests: ${err.message}`);
        });

      const eventRequests: SimplifiedEventRequest[] = rawRequests.map(
        (req: any) => ({
          eventName: req.eventId?.title || "Unknown Event",
          requestedId: req._id.toString(),
          requestedBy: req.userId?.email || "Unknown User",
          type: req.eventId?.eventType || "Unknown Type",
          requestedDate: req.createdAt
            ? new Date(req.createdAt).toISOString()
            : "N/A",
          status: req.status || "pending",
          proposedDate: req.eventId?.date
            ? new Date(req.eventId.date).toISOString()
            : "N/A",
        })
      );

      return {
        eventRequests,
        totalItems,
        totalPages,
        currentPage: page,
      };
    } catch (err: any) {
      console.error(`Error in getEventRequests use case:`, err);
      throw new Error(err.message || "Failed to fetch event requests.");
    }
  }
}

export const getEventRequests = new GetEventRequests();
