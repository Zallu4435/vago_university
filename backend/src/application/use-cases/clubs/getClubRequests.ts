import { ClubRequestModel } from '../../../infrastructure/database/mongoose/models/club.model';

interface GetClubRequestsParams {
  page: number;
  limit: number;
  status: string;
}

interface GetClubRequestsResponse {
  clubs: any[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

class GetClubRequests {
  async execute({
    page,
    limit,
    status,
  }: GetClubRequestsParams): Promise<GetClubRequestsResponse> {
    try {
      console.log(`Executing getClubRequests use case with params:`, {
        page,
        limit,
        status,
      });

      const query: any = {};
      if (status !== 'all') query.status = status;

      const totalItems = await ClubRequestModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count club requests: ${err.message}`);
      });
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      const clubs = await ClubRequestModel.find(query)
        .select('name category description createdBy status rejectionReason')
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query club requests: ${err.message}`);
        });

      return {
        clubs,
        totalItems,
        totalPages,
        currentPage: page,
      };
    } catch (err) {
      console.error(`Error in getClubRequests use case:`, err);
      throw err;
    }
  }
}

export const getClubRequests = new GetClubRequests();