import { ClubModel } from "../../../infrastructure/database/mongoose/models/club.model";

interface GetClubsParams {
  search: string;
  type?: string;
  status: 'active' | 'inactive' | 'all';
}

interface GetClubsResponse {
  clubs: any[];
  total: number;
}

class GetClubs {
  async execute({ search, type, status }: GetClubsParams): Promise<GetClubsResponse> {
    try {
      console.log(`Executing getClubs use case with params:`, { search, type, status });

      const query: any = {};
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }
      if (type) {
        query.type = { $regex: type, $options: 'i' };
      }
      if (status !== 'all') {
        query.status = status;
      }

      const total = await ClubModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count clubs: ${err.message}`);
        });

      const clubs = await ClubModel.find(query)
        .select('id name type members icon color status role nextMeeting about upcomingEvents')
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch clubs: ${err.message}`);
        });

      return {
        clubs,
        total,
      };
    } catch (err) {
      console.error(`Error in getClubs use case:`, err);
      throw err;
    }
  }
}

export const getClubs = new GetClubs();