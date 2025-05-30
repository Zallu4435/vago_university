import { TeamModel } from "../../../infrastructure/database/mongoose/models/sports.model";

class DeleteTeam {
  async execute(id: string): Promise<void> {
    try {
      const team = await TeamModel.findByIdAndDelete(id).catch((err) => {
        throw new Error(`Failed to delete team: ${err.message}`);
      });

      if (!team) {
        throw new Error("Team not found");
      }
    } catch (err) {
      console.error(`Error in deleteTeam use case:`, err);
      throw err;
    }
  }
}

export const deleteTeam = new DeleteTeam();
