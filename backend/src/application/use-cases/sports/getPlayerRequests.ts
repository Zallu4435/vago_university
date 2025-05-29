import { SportRequestModel } from '../../../infrastructure/database/mongoose/models/sports.model';

interface GetPlayerRequestsParams {
  page: number;
  limit: number;
  type: string;
  status: string;
  startDate?: string; // Added for date range filtering
  endDate?: string; // Added for date range filtering
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
  playerRequests: SimplifiedPlayerRequest[]; // Corrected from teamRequests
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
    startDate,
    endDate,
  }: GetPlayerRequestsParams): Promise<GetPlayerRequestsResponse> {
    try {
      console.log(`Executing getPlayerRequests use case with params:`, {
        page,
        limit,
        type,
        status,
        startDate,
        endDate,
      });

      if (page < 1 || limit < 1) {
        throw new Error('Invalid pagination parameters.');
      }

      const query: any = {};
      if (type && type !== 'all') {
        query.type = { $regex: `^${type}$`, $options: 'i' }; // Case-insensitive match
      }
      if (status && status !== 'all') {
        query.status = { $regex: `^${status}$`, $options: 'i' }; // Case-insensitive match
      }
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          throw new Error('Invalid date format in startDate or endDate parameters');
        }
        query.createdAt = {
          $gte: start,
          $lte: end,
        };
      }

      const totalItems = await SportRequestModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count player requests: ${err.message}`);
      });
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      const rawRequests = await SportRequestModel.find(query)
        .populate('sportId', 'title type') // Assuming sportId is a reference to a model with title and type
        .populate('userId', 'email') 
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query player requests: ${err.message}`);
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
      console.error(`Error in getPlayerRequests use case:`, err);
      throw new Error(err.message || 'Failed to fetch player requests.');
    }
  }
}

export const getPlayerRequests = new GetPlayerRequests();