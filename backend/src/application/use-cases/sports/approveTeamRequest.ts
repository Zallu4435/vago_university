import { SportRequestModel, TeamModel } from '../../../infrastructure/database/mongoose/models/sports.model';

class ApproveTeamRequest {
  async execute(id: string): Promise<void> {
    try {
      console.log(`Executing approveTeamRequest use case with id:`, id);

      const teamRequest = await SportRequestModel.findById(id).catch((err) => {
        throw new Error(`Failed to find team request: ${err.message}`);
      });

      if (!teamRequest) {
        throw new Error('Team request not found');
      }

      if (teamRequest.status !== 'pending') {
        throw new Error('Team request is not in pending status');
      }

      await SportRequestModel.findByIdAndUpdate(
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