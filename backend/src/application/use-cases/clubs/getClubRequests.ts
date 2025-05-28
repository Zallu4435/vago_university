import { ClubRequestModel } from '../../../infrastructure/database/mongoose/models/club.model';

interface GetClubRequestsParams {
  page: number;
  limit: number;
  status: string;
}

interface ClubRequest {
  id: string;
  clubName: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface GetClubRequestsResponse {
  clubs: ClubRequest[];
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
      const query: any = {};
      if (status !== 'all') query.status = status;

      const totalItems = await ClubRequestModel.countDocuments(query);
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      const requests = await ClubRequestModel.find(query)
        .populate('clubId', 'name type')       // Assuming clubId is a reference to Club
        .populate('userId', 'email')       // Assuming userId is a reference to User
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const clubs = requests.map((request): ClubRequest => ({
        id: request._id.toString(),
        clubName: request.clubId?.name || 'Unknown Club',
        requestedBy: request.userId?.email || 'Unknown User',
        requestedAt: new Date(request.createdAt).toISOString(),
        status: request.status,
        type: request.clubId?.type
      }));

      return {
        clubs,
        totalItems,
        totalPages,
        currentPage: page,
      };
    } catch (err) {
      console.error(`Error in GetClubRequests use case:`, err);
      throw new Error('Failed to fetch club join requests.');
    }
  }
}

export const getClubRequests = new GetClubRequests();
