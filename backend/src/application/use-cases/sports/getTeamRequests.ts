import { TeamRequestModel } from '../../../infrastructure/database/mongoose/models/sports.model';

interface GetTeamRequestsParams {
  page: number;
  limit: number;
  status: string;
}

interface GetTeamRequestsResponse {
  teamRequests: any[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

class GetTeamRequests {
  async execute({
    page,
    limit,
    status,
  }: GetTeamRequestsParams): Promise<GetTeamRequestsResponse> {
    try {
      console.log(`Executing getTeamRequests use case with params:`, {
        page,
        limit,
        status,
      });

      const query: any = {};
      if (status !== 'all') query.status = status;

      const totalItems = await TeamRequestModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count team requests: ${err.message}`);
      });
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      const teamRequests = await TeamRequestModel.find(query)
        .select('teamName sportType requestedBy reason requestedAt status rejectionReason')
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query team requests: ${err.message}`);
        });

      return {
        teamRequests,
        totalItems,
        totalPages,
        currentPage: page,
      };
    } catch (err) {
      console.error(`Error in getTeamRequests use case:`, err);
      throw err;
    }
  }
}

export const getTeamRequests = new GetTeamRequests();