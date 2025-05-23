import { MemberRequestModel } from '../../../infrastructure/database/mongoose/models/club.model';

interface GetMemberRequestsParams {
  page: number;
  limit: number;
  status: string;
}

interface GetMemberRequestsResponse {
  clubs: any[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

class GetMemberRequests {
  async execute({
    page,
    limit,
    status,
  }: GetMemberRequestsParams): Promise<GetMemberRequestsResponse> {
    try {
      console.log(`Executing getMemberRequests use case with params:`, {
        page,
        limit,
        status,
      });

      const query: any = {};
      if (status !== 'all') query.status = status;

      const totalItems = await MemberRequestModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count member requests: ${err.message}`);
      });
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      const clubs = await MemberRequestModel.find(query)
        .select('clubId userId status rejectionReason')
        .populate('clubId', 'name')
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query member requests: ${err.message}`);
        });

      return {
        clubs,
        totalItems,
        totalPages,
        currentPage: page,
      };
    } catch (err) {
      console.error(`Error in getMemberRequests use case:`, err);
      throw err;
    }
  }
}

export const getMemberRequests = new GetMemberRequests();