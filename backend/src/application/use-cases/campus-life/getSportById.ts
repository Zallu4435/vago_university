import { TeamModel } from "../../../infrastructure/database/mongoose/models/sports.model";


interface GetSportByIdParams {
  sportId: string;
}

class GetSportById {
  async execute({ sportId }: GetSportByIdParams): Promise<any> {
    try {
      console.log(`Executing getSportById use case with sportId:`, sportId);

      const sport = await TeamModel.findById(sportId)
        .select('id title type teams icon color division headCoach homeGames record upcomingGames')
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch sport: ${err.message}`);
        });

      if (!sport) {
        throw new Error('Sport not found');
      }

      return sport;
    } catch (err) {
      console.error(`Error in getSportById use case:`, err);
      throw err;
    }
  }
}

export const getSportById = new GetSportById();