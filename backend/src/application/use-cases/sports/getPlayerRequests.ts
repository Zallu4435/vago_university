import { SportRequestModel } from '../../../infrastructure/database/mongoose/models/sports.model';

interface GetPlayerRequestsParams {
  page: number;
  limit: number;
  type: string;
  status: string;
  // requestedBy: string;
}

interface SimplifiedPlayerRequest {
  teamName: string;
  requestId: string;
  requestedBy: string;
  type: string;
  requestedDate: string;
  status: string;
}

interface GetPlayerRequestsResponse {
  teamRequests: SimplifiedPlayerRequest[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

class GetPlayerRequests {
  async execute({
    page,
    limit,
    type,
    status,
    // requestedBy,
  }: GetPlayerRequestsParams): Promise<GetPlayerRequestsResponse> {
    try {
      if (page < 1 || limit < 1) {
        throw new Error('Invalid pagination parameters.');
      }

      const query: any = {};
      if (type && type !== 'all') query.sportType = type;
      if (status && status !== 'all') query.status = status;
      // if (requestedBy && requestedBy !== 'all') query.requestedBy = requestedBy;

      const totalItems = await SportRequestModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count team requests: ${err.message}`);
      });
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      const rawRequests = await SportRequestModel.find(query)
        .populate('sportId', 'title type') // Assuming eventId is a reference to CampusEventModel
        .populate('userId', 'email') 
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query team requests: ${err.message}`);
        });

      const playerRequests: SimplifiedPlayerRequest[] = rawRequests.map((req: any) => ({
        teamName: req.sportId?.title || 'Unknown Team',
        requestId: req._id.toString(),
        requestedBy: req.userId?.email || 'Unknown User',
        type: req.sportId?.type || 'Unknown',
        requestedDate: req.createdAt,
        status: req.status,
      }));

      return {
        playerRequests,
        totalItems,
        totalPages,
        currentPage: page,
      };
    } catch (err: any) {
      console.error(`Error in getTeamRequests use case:`, err);
      throw new Error(err.message || 'Failed to fetch team requests.');
    }
  }
}

export const getPlayerRequests = new GetPlayerRequests();