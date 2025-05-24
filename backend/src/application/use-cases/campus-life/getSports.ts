import { TeamModel } from "../../../infrastructure/database/mongoose/models/sports.model";

interface GetSportsParams {
  type?: "VARSITY SPORTS" | "INTRAMURAL SPORTS";
  search: string;
}

interface GetSportsResponse {
  sports: any[];
  total: number;
}

class GetSports {
  async execute({ type, search }: GetSportsParams): Promise<GetSportsResponse> {
    try {
      console.log(`Executing getSports use case with params:`, {
        type,
        search,
      });

      const query: any = {};
      if (type) {
        query.type = type;
      }
      if (search) {
        query.title = { $regex: search, $options: "i" };
      }

      const total = await TeamModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count sports: ${err.message}`);
      });

      const sports = await TeamModel.find(query)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch sports: ${err.message}`);
        });

      return {
        sports,
        total,
      };
    } catch (err) {
      console.error(`Error in getSports use case:`, err);
      throw err;
    }
  }
}

export const getSports = new GetSports();
