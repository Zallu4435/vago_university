import { TeamModel } from '../../../infrastructure/database/mongoose/models/sports.model';

interface GetTeamsParams {
  page: number;
  limit: number;
  sportType: string;
  status: string;
  coach: string;
}

interface GetTeamsResponse {
  teams: any[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

class GetTeams {
  async execute({
    page,
    limit,
    sportType,
    status,
    coach,
  }: GetTeamsParams): Promise<GetTeamsResponse> {
    try {
      console.log(`Executing getTeams use case with params:`, {
        page,
        limit,
        sportType,
        status,
        coach,
      });

      const query: any = {};
      if (sportType !== 'all') query.sportType = sportType;
      if (status !== 'all') query.status = status;
      if (coach !== 'all') query.coach = coach;

      const totalItems = await TeamModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count teams: ${err.message}`);
      });
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      const teams = await TeamModel.find(query)
        .select('name sportType coach playerCount status formedOn logo')
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query teams: ${err.message}`);
        });

      return {
        teams,
        totalItems,
        totalPages,
        currentPage: page,
      };
    } catch (err) {
      console.error(`Error in getTeams use case:`, err);
      throw err;
    }
  }
}

export const getTeams = new GetTeams();