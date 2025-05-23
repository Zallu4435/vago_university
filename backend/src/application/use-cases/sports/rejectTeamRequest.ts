import { TeamRequestModel } from '../../../infrastructure/database/mongoose/models/sports.model';

interface RejectTeamRequestParams {
  id: string;
  reason: string;
}

class RejectTeamRequest {
  async execute({ id, reason }: RejectTeamRequestParams): Promise<void> {
    try {
      console.log(`Executing rejectTeamRequest use case with id:`, id, `and reason:`, reason);

      const teamRequest = await TeamRequestModel.findById(id).catch((err) => {
        throw new Error(`Failed to find team request: ${err.message}`);
      });

      if (!teamRequest) {
        throw new Error('Team request not found');
      }

      if (teamRequest.status !== 'pending') {
        throw new Error('Team request is not in pending status');
      }

      await TeamRequestModel.findByIdAndUpdate(
        id,
        { status: 'rejected', rejectionReason: reason, updatedAt: Date.now() },
        { runValidators: true }
      ).catch((err) => {
        throw new Error(`Failed to update team request: ${err.message}`);
      });
    } catch (err) {
      console.error(`Error in rejectTeamRequest use case:`, err);
      throw err;
    }
  }
}

export const rejectTeamRequest = new RejectTeamRequest();