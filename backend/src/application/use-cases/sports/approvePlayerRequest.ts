import { SportRequestModel, TeamModel } from '../../../infrastructure/database/mongoose/models/sports.model';

class ApprovePlayerRequest {
  async execute(id: string): Promise<void> {
    try {
      const teamRequest = await SportRequestModel.findById(id).catch((err) => {
        throw new Error(`Failed to find team request: ${err.message}`);
      });

      if (!teamRequest) {
        throw new Error('Team request not found');
      }

      if (teamRequest.status !== 'pending') {
        throw new Error('Team request is not in pending status');
      }

      // Approve the team request
      await SportRequestModel.findByIdAndUpdate(
        id,
        { status: 'approved', updatedAt: Date.now() },
        { runValidators: true }
      ).catch((err) => {
        throw new Error(`Failed to update team request: ${err.message}`);
      });

      // Increment player count in the TeamModel using teamId
      const updatedTeam = await TeamModel.findByIdAndUpdate(
        teamRequest.sportId,
        { $inc: { participants: 1 } },
        { new: true }
      ).catch((err) => {
        throw new Error(`Failed to increment player count: ${err.message}`);
      });

      if (!updatedTeam) {
        console.warn(`No matching team found for ID: ${teamRequest.sportId}`);
      } else {
        console.log(`Player count incremented for team ID: ${teamRequest.sportId}`);
      }

    } catch (err: any) {
      console.error(`Error in approveTeamRequest use case:`, err);
      throw err;
    }
  }
}

export const approvePlayerRequest = new ApprovePlayerRequest();