import { ClubModel } from '../../../infrastructure/database/mongoose/models/club.model';

interface GetClubsParams {
  page: number;
  limit: number;
  category: string;
  status: string;
}

interface GetClubsResponse {
  clubs: any[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

class GetClubs {
  async execute({
    page,
    limit,
    category,
    status,
  }: GetClubsParams): Promise<GetClubsResponse> {
    try {
      console.log(`Executing getClubs use case with params:`, {
        page,
        limit,
        category,
        status,
      });

      const query: any = {};
      if (category !== 'all') query.category = category;
      if (status !== 'all') query.status = status;

      const totalItems = await ClubModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count clubs: ${err.message}`);
      });
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      const clubs = await ClubModel.find(query)
        .select('name category description type createdBy status createdAt members color icon')
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query clubs: ${err.message}`);
        });

      return {
        clubs,
        totalItems,
        totalPages,
        currentPage: page,
      };
    } catch (err) {
      console.error(`Error in getClubs use case:`, err);
      throw err;
    }
  }
}

export const getClubs = new GetClubs();