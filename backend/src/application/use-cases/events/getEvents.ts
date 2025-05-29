import { CampusEventModel } from "../../../infrastructure/database/mongoose/models/events.model";
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
      const query: any = {};
      if (type !== "all") query.eventType = type;
      if (status !== "all") query.status = status;

      if (startDate || endDate) {
        query.date = {};
        if (startDate) {
          query.date.$gte = startDate.toISOString().split("T")[0];
        }
        if (endDate) {
          query.date.$lte = endDate.toISOString().split("T")[0];
        }
      }

      const totalItems = await CampusEventModel.countDocuments(query).catch(
        (err) => {
          throw new Error(`Failed to count events: ${err.message}`);
        }
      );
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      const events = await CampusEventModel.find(query)
        .select("title organizerType eventType date location status")
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
