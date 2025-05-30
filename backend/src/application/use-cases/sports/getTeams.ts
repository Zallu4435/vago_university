import { TeamModel } from "../../../infrastructure/database/mongoose/models/sports.model";

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
      const query: any = {};
      if (sportType !== "all") {
        query.type = { $regex: `^${sportType}$`, $options: "i" };
      }
      if (status !== "all") {
        query.status = { $regex: `^${status}$`, $options: "i" };
      }

      if (coach !== "all") {
        const [startDate, endDate] = coach
          .split(",")
          .map((date) => date.trim());
        if (!startDate || !endDate) {
          throw new Error(
            "Invalid coach date range format. Expected: startDate,endDate"
          );
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          throw new Error("Invalid date format in coach parameter");
        }

        query.createdAt = {
          $gte: start,
          $lte: end,
        };
      }

      const totalItems = await TeamModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count teams: ${err.message}`);
      });
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      const teams = await TeamModel.find(query)
        .select("title type headCoach playerCount status createdAt icon")
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
