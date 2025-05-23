import { TeamRequestModel, TeamModel } from '../../../infrastructure/database/mongoose/models/sports.model';

class ApproveTeamRequest {
  async execute(id: string): Promise<void> {
    try {
      console.log(`Executing approveTeamRequest use case with id:`, id);

      const teamRequest = await TeamRequestModel.findById(id).catch((err) => {
        throw new Error(`Failed to find team request: ${err.message}`);
      });

      if (!teamRequest) {
        throw new Error('Team request not found');
      }

      if (teamRequest.status !== 'pending') {
        throw new Error('Team request is not in pending status');
      }

      await TeamModel.create({
        name: teamRequest.teamName,
        sportType: teamRequest.sportType,
        coach: '',
        playerCount: 0,
        status: 'active',
        formedOn: teamRequest.requestedAt,
        logo: '',
      }).catch((err) => {
        throw new Error(`Failed to create team: ${err.message}`);
      });

      await TeamRequestModel.findByIdAndUpdate(
        id,
        { status: 'approved', updatedAt: Date.now() },
        { runValidators: true }
      ).catch((err) => {
        throw new Error(`Failed to update team request: ${err.message}`);
      });
    } catch (err) {
      console.error(`Error in approveTeamRequest use case:`, err);
      throw err;
    }
  }
}

export const approveTeamRequest = new ApproveTeamRequest();