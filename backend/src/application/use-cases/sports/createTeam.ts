import { TeamModel } from '../../../infrastructure/database/mongoose/models/sports.model';

interface CreateTeamParams {
  name: string;
  sportType: string;
  coach: string;
  playerCount: number;
  status: string;
  formedOn: string;
  logo: string;
}

class CreateTeam {
  async execute(data: CreateTeamParams): Promise<any> {
    try {
      console.log(`Executing createTeam use case with data:`, data);

      // Make status lowercase
      const normalizedData = {
        ...data,
        status: data.status.toLowerCase(),
      };

      const team = await TeamModel.create(normalizedData).catch((err) => {
        throw new Error(`Failed to create team: ${err.message}`);
      });

      return team.toObject();
    } catch (err) {
      console.error(`Error in createTeam use case:`, err);
      throw err;
    }
  }
}

export const createTeam = new CreateTeam();
