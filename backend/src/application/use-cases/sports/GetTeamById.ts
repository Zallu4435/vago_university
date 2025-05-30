import { TeamModel } from "../../../infrastructure/database/mongoose/models/sports.model";

class GetTeamById {
  async execute(id: string): Promise<any> {
    try {
      const team = await TeamModel.findById(id)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query team: ${err.message}`);
        });

      if (!team) {
        throw new Error("Team not found");
      }

      return team;
    } catch (err) {
      console.error(`Error in getTeamById use case:`, err);
      throw err;
    }
  }
}

export const getTeamById = new GetTeamById();
