import { PlayerRequestModel } from '../../../infrastructure/database/mongoose/models/sports.model';

interface GetPlayerRequestsParams {
  page: number;
  limit: number;
  status: string;
}

interface GetPlayerRequestsResponse {
  playerRequests: any[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

class GetPlayerRequests {
  async execute({
    page,
    limit,
    status,
  }: GetPlayerRequestsParams): Promise<GetPlayerRequestsResponse> {
    try {
      console.log(`Executing getPlayerRequests use case with params:`, {
        page,
        limit,
        status,
      });

      const query: any = {};
      if (status !== 'all') query.status = status;

      const totalItems = await PlayerRequestModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count player requests: ${err.message}`);
      });
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      const playerRequests = await PlayerRequestModel.find(query)
        .select('studentName studentId team sport reason requestedAt status rejectionReason')
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query player requests: ${err.message}`);
        });

      return {
        playerRequests,
        totalItems,
        totalPages,
        currentPage: page,
      };
    } catch (err) {
      console.error(`Error in getPlayerRequests use case:`, err);
      throw err;
    }
  }
}

export const getPlayerRequests = new GetPlayerRequests();