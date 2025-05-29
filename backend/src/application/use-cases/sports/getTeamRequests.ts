import { SportRequestModel } from '../../../infrastructure/database/mongoose/models/sports.model';

interface GetTeamRequestsParams {
  page: number;
  limit: number;
  type: string;
  status: string;
  startDate?: string; // Added for date range filtering
  endDate?: string; // Added for date range filtering
}

interface SimplifiedTeamRequest {
  teamName: string;
  requestId: string;
  requestedBy: string;
  type: string;
  requestedDate: string;
  status: string;
}

interface GetTeamRequestsResponse {
  teamRequests: SimplifiedTeamRequest[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

class GetTeamRequests {
  async execute({
    page,
    limit,
    type,
    status,
    startDate,
    endDate,
  }: GetTeamRequestsParams): Promise<GetTeamRequestsResponse> {
    try {
      console.log(`Executing getTeamRequests use case with params:`, {
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
        query.sportType = { $regex: `^${type}$`, $options: 'i' }; // Case-insensitive match
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
        throw new Error(`Failed to count team requests: ${err.message}`);
      });
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      const rawRequests = await SportRequestModel.find(query)
        .populate('sportId', 'title type') // Assuming sportId is a reference to a model with title and type
        .populate('userId', 'email') // Assuming userId is a reference to a model with email
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query team requests: ${err.message}`);
        });

      const teamRequests: SimplifiedTeamRequest[] = rawRequests.map((req: any) => ({
        teamName: req.sportId?.title || 'Unknown Team',
        requestId: req._id.toString(),
        requestedBy: req.userId?.email || 'Unknown User', // Corrected to use userId
        type: req.sportId?.type || 'Unknown',
        requestedDate: req.createdAt,
        status: req.status,
      }));

      return {
        teamRequests,
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

export const getTeamRequests = new GetTeamRequests();