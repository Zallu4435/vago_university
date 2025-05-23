import { TeamModel } from '../../../infrastructure/database/mongoose/models/sports.model';

interface UpdateTeamParams {
  name?: string;
  sportType?: string;
  coach?: string;
  playerCount?: number;
  status?: string;
  formedOn?: string;
  logo?: string;
}

class UpdateTeam {
  async execute(id: string, data: UpdateTeamParams): Promise<any> {
    try {
      console.log(`Executing updateTeam use case with id:`, id, `and data:`, data);

      const team = await TeamModel.findByIdAndUpdate(
        id,
        { ...data, updatedAt: Date.now() },
        { new: true, runValidators: true }
      )
        .select('name sportType coach playerCount status formedOn logo')
        .lean()
        .catch((err) => {
          throw new Error(`Failed to update team: ${err.message}`);
        });

      if (!team) {
        throw new Error('Team not found');
      }

      return team;
    } catch (err) {
      console.error(`Error in updateTeam use case:`, err);
      throw err;
    }
  }
}

export const updateTeam = new UpdateTeam();